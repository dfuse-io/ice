import React, {useEffect, useState} from 'react';
import {IdeaRow, PoolRow, PoolRowForm} from "../../types";
import { useAppState } from "../../state";
import {Row, Col,Form, Input, Select, Modal, message, Empty, Button} from "antd";
import { FileAddOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PoolView } from "../pool-view/pool-view"
import {styled} from "../../theme";
import {NewIdea} from "../new-idea/new-idea";
import {addPoolTrx} from "../../utils/trx";
const { Option } = Select;
const { Search } = Input


const PoolSelectorWrapper = styled.div`
    .ant-select-selector {
        border: none;
    }
`

export const PoolSelector: React.FC = () => {
    const [pools, setPools] = useState<PoolRow[]>([]);
    const [newPool, setNewPool] = useState(false);
    const [showNewIdea,setShowNewIdea] = useState(false)
    const [creatingPool, setCreatingPool] = useState(false);
    const [selectedPool, setSelectedPool] = useState<PoolRow>(null!);
    const { dfuseClient, contractAccount, activeUser, accountName, loggedIn} = useAppState()

    useEffect(() => {
        fetchPools();
    }, [dfuseClient, loggedIn]);

    const fetchPools = () =>  {
        try {
            dfuseClient.stateTable<PoolRow>(contractAccount, contractAccount, "pools")
                .then((poolsResult) => {
                    let poolRows: PoolRow[] = [];
                    poolsResult.rows.map(r => {
                        let pool: PoolRow = r.json!;
                        poolRows.push(pool);
                    });
                    setPools(poolRows)
                })
        } catch (e) {
            // message.error("Oops! we ran into an issue getting your pools: ", e)
        }
    }

    const onChange = (value) => {
        if (value == "new_pool") {
            setNewPool(true)
        } else {
            pools.map( p => {
                if( p.pool_name == value) {
                    setSelectedPool(p)
                }
            })
        }
    }

    const  createPool = async (pool: PoolRowForm): Promise<PoolRow>    => {
        try {
            await activeUser.signTransaction(addPoolTrx(contractAccount, accountName,pool), { broadcast: true })
            return {pool_name: pool.name} as PoolRow
        } catch (error) {
            throw error
        }
    }

    const handleCreatePool = (poolName: string) => {
        setCreatingPool(true)
        const poolForm = {name: poolName} as PoolRowForm
        createPool(poolForm).then((poolRow) => {
            setCreatingPool(false)
            setNewPool(false)
            setPools([...pools, poolRow])
            setSelectedPool(poolRow)
            message.info(`Hurray! '${poolName}' was created!`);
        }).catch( e => {
            setCreatingPool(false)
            message.error(`Oops unable to create pool: ${e}`);
        })
    }
    const renderPoolSelector = () => {
        let selectSpan = 24
        let showAddKey = false
        if (selectedPool && loggedIn) {
            selectSpan = 19
            showAddKey = true
        }

        return (
            <Row>
                <Col span={selectSpan}>
                    <Select
                        defaultValue={selectedPool?.pool_name}
                        showSearch
                        style={{width: "100%"}}
                        placeholder="Select a pool"
                        onChange={onChange}
                    >
                        {pools.map((p) => (
                            <Option key={`pool-${p.pool_name}`} value={p.pool_name}>{p.pool_name}</Option>
                        ))}
                        { loggedIn && <Option key={`pool-new_pool`} value={"new_pool"}>create a new pool</Option>}

                    </Select>
                </Col>
                {
                    showAddKey && (
                        <Col span={5}>
                            <Button type="primary" onClick={() => setShowNewIdea(true)} block>
                                <FileAddOutlined /> New Idea
                            </Button>
                        </Col>
                    )
                }

            </Row>
        )
    }
    const renderPoolCreator = () => {
        return (
            <Row>
                <Col span={22}>
            <Search placeholder="Enter a pool name" onSearch={value => handleCreatePool(value)} loading={creatingPool} enterButton="Create Pool" />
                </Col>
                <Col span={2}>
                    <Button type="primary" danger onClick={() => setNewPool(false)}>
                        <CloseCircleOutlined />
                    </Button>

                </Col>
            </Row>
        )
    }
    const poolViewPlaceholder = () => {
        return (
            <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                    height: 60,
                }}
                style={{marginTop: "20px"}}
                description={<span>Select a <a href="#">Pool!</a></span>}
            />
        )
    }

    const onNewIdeaCreated = (idea: IdeaRow) => {
        fetchPools();
        setShowNewIdea(false)
        message.info(`Hurray! '${idea.title}' was created!`);
    }

    const onNewIdeaError = (error: string) => {

        setShowNewIdea(false)
        message.error(`Oops unable to create an idea: ${error}`);
    }

    const onNewIdeaCancel = () => {
        setShowNewIdea(false)
    }



    return(
        <>
            { !newPool && renderPoolSelector() }
            { newPool && renderPoolCreator() }
            { !selectedPool && poolViewPlaceholder() }
            { selectedPool && (
                <>
                    <PoolView pool={selectedPool}/>
                    <NewIdea pool={selectedPool} show={showNewIdea} onCreated={onNewIdeaCreated} onError={onNewIdeaError} onCancel={onNewIdeaCancel}/>
                </>
            )}

        </>
    )
};