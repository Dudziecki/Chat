import React, { useEffect, useState } from 'react';
import s2 from '../../s1-main/App.module.css';
import s from './HW15.module.css';
import axios from 'axios';
import SuperPagination from './common/c9-SuperPagination/SuperPagination';
import { useSearchParams } from 'react-router-dom';
import SuperSort from './common/c10-SuperSort/SuperSort';

type TechType = {
    id: number;
    tech: string;
    developer: string;
};

type ParamsType = {
    sort: string;
    page: number;
    count: number;
};

const getTechs = (params: ParamsType) => {
    return axios
        .get<{ techs: TechType[]; totalCount: number }>(
            'https://samurai.it-incubator.io/api/3.0/homework/test3',
            { params }
        )
        .catch((e) => {
            alert(e.response?.data?.errorText || e.message);
            throw e;
        });
};

const HW15 = () => {
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(4);
    const [idLoading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(100);
    const [searchParams, setSearchParams] = useSearchParams();
    const [techs, setTechs] = useState<TechType[]>([]);

    const sendQuery = (params: ParamsType) => {
        setLoading(true);
        getTechs(params)
            .then((res) => {
                if (res && res.data) {
                    setTechs(res.data.techs);
                    setTotalCount(res.data.totalCount);
                }
            })
            .catch(() => {
                // Error is already handled in getTechs via alert
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onChangePagination = (newPage: number, newCount: number) => {
        setPage(newPage);
        setCount(newCount);
        const params = { sort, page: newPage, count: newCount };
        sendQuery(params);
        setSearchParams({ sort, page: String(newPage), count: String(newCount) });
    };

    const onChangeSort = (newSort: string) => {
        setSort(newSort);
        setPage(1);
        const params = { sort: newSort, page: 1, count };
        sendQuery(params);
        setSearchParams({ sort: newSort, page: '1', count: String(count) });
    };

    useEffect(() => {
        const paramsFromURL = Object.fromEntries(searchParams);
        const initialParams = {
            sort: paramsFromURL.sort || '',
            page: Number(paramsFromURL.page) || 1,
            count: Number(paramsFromURL.count) || 4,
        };
        setPage(initialParams.page);
        setCount(initialParams.count);
        setSort(initialParams.sort);
        sendQuery(initialParams);
    }, [searchParams]); // зависимость от searchParams чтобы реагировать на изменения URL

    const mappedTechs = techs.map((t) => (
        <div key={t.id} className={s.row}>
            <div id={'hw15-tech-' + t.id} className={s.tech}>
                {t.tech}
            </div>
            <div id={'hw15-developer-' + t.id} className={s.developer}>
                {t.developer}
            </div>
        </div>
    ));

    return (
        <div id={'hw15'}>
            <div className={s2.hwTitle}>Homework #15</div>

            <div className={s2.hw}>
                {idLoading && <div id={'hw15-loading'} className={s.loading}></div>}

                <SuperPagination
                    page={page}
                    itemsCountForPage={count}
                    totalCount={totalCount}
                    onChange={onChangePagination}
                />

                <div className={s.rowHeader}>
                    <div className={s.techHeader}>
                        tech
                        <SuperSort sort={sort} value={'tech'} onChange={onChangeSort} />
                    </div>

                    <div className={s.developerHeader}>
                        developer
                        <SuperSort sort={sort} value={'developer'} onChange={onChangeSort} />
                    </div>
                </div>

                {mappedTechs}
            </div>
        </div>
    );
};

export default HW15;