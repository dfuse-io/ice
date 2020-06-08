import React from 'react';
import { PoolRow } from '../../types';
import { IdeaList } from '../idea-list/idea-list';

interface PoolViewProps {
  pool: PoolRow;
}

export const PoolView: React.FC<PoolViewProps> = ({ pool }: PoolViewProps) => {
  return (
    <>
      <>
        <IdeaList poolName={pool.pool_name} />
      </>
    </>
  );
};
