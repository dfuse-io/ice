import React, {useEffect, useState} from 'react';
import {PoolRow} from "../../types";
import { useAppState } from "../../state";
import {Col,Form, Input, Select, Modal, message, Empty, Button} from "antd";
import { FileAddOutlined } from '@ant-design/icons';
import { PoolView } from "../pool-view/pool-view"
import {styled} from "../../theme";
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
    const [addIdea,setAddIdea] = useState(false)
    const [creatingPool, setCreatingPool] = useState(false);
    const [selectedPool, setSelectedPool] = useState<PoolRow>(null!);
    const { dfuseClient, contractAccount, activeUser, accountName} = useAppState()

    useEffect(() => {
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
            console.log("An error occurred", e)
        }
    }, [dfuseClient]);

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

    const  create = async (pool: PoolRow): Promise<void>    => {
        const demoTransaction = {
            actions: [{
                account: contractAccount,
                name: 'addpool',
                authorization: [{
                    actor: accountName,
                    permission: 'active',
                }],
                data: {
                    "author":accountName,
                    "name": pool.pool_name,
                    "description": pool.description
                },
            }],
        }
        try {
            await activeUser.signTransaction(demoTransaction, { broadcast: true })
        } catch (error) {
            throw error
        }
    }

    const createPool = (poolName: string) => {
        setCreatingPool(true)
        const pool = {pool_name: poolName, description: ""} as PoolRow
        create(pool).then(() => {
            setCreatingPool(false)
            setNewPool(false)
            setPools([...pools, pool])
            setSelectedPool(pool)
            message.info(`Hurray! '${poolName}' was created!`);
        }).catch( e => {
            setCreatingPool(false)
            message.error(`Oops unable to create pool: ${e}`);
        })
    }
    const handleOk = e => {
        console.log(e);
        setAddIdea(false)
    };

    const handleCancel = e => {
        console.log(e);
        setAddIdea(false)
    };
    const renderPoolSelector = () => {
        return (
            <PoolSelectorWrapper>
                <Select
                    defaultValue={selectedPool?.pool_name}
                    showSearch
                    style={{width: "100%"}}
                    placeholder="Select a pool"
                    onChange={onChange}
                >
                    {pools.map((p) => (
                        <Option value={p.pool_name}>{p.pool_name}</Option>
                    ))}
                    <Option value={"new_pool"}>create a new pool</Option>
                </Select>
                {
                    selectedPool &&
                    <Button type="primary" onClick={() => setAddIdea(true)}>
                        <FileAddOutlined /> New Idea
                    </Button>
                }


            </PoolSelectorWrapper>
        )
    }
    const renderPoolCreator = () => {
        return (
            <Search placeholder="Enter a pool name" onSearch={value => createPool(value)} loading={creatingPool} enterButton="Create Pool" />
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

    return(
        <>
            { !newPool && renderPoolSelector()}
            { newPool && renderPoolCreator()}
            { !selectedPool && poolViewPlaceholder()}
            { selectedPool && (
                <>
                    <PoolView pool={selectedPool}/>
                </>
            )}
            <Modal
                title="Basic Modal"
                visible={addIdea}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                >
                    <Form.Item label="Idea Title">
                        <Input placeholder="Enter you title" />
                    </Form.Item>
                    <Form.Item label="Idea Description">
                        <Input placeholder="Enter you description" />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};