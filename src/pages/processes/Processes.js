import React, {useEffect, useState} from "react";
import API from "../../API/API";
import {Alert, Backdrop, Box, CircularProgress, Tab, Tabs, TextField} from "@mui/material";
import {Chart} from "react-google-charts";
import MyTable from "./MyTable";

// [
//     {
//         "start": "2022-11-18T09:38:28.043470Z",
//         "stop": "2022-11-18T09:50:46.044033Z",
//         "id": 117195,
//         "info": "SELECT\n*\nFROM\nvx1_article\nWHERE\nlanguage_id IS NOT NULL",
//         "command": "Query",
//         "query_ID": 10304012,
//         "time": 0,
//         "time_MS": 360.441,
//         "stage": 0,
//         "max_STAGE": 0,
//         "progress": 0,
//         "memory_USED": 97816,
//         "max_MEMORY_USED": 4388576,
//         "examined_ROWS": 0,
//         "tid": 1289430,
//         "user": "rouser",
//         "host": "localhost:39078",
//         "db": "clbrt",
//         "state": "Sending data",
//         "info_BINARY": "U0VMRUNUCioKRlJPTQp2eDFfYXJ0aWNsZQpXSEVSRQpsYW5ndWFnZV9pZCBJUyBOT1QgTlVMTA=="
//     },
//     {
//         "start": "2022-11-18T09:42:44.041450Z",
//         "stop": "2022-11-18T09:50:46.044048Z",
//         "id": 117419,
//         "info": "SELECT\n*\nFROM\nvx1_article\nWHERE\nlanguage_id IS NOT NULL\nLIMIT 1000",
//         "command": "Query",
//         "query_ID": 10307708,
//         "time": 0,
//         "time_MS": 957.245,
//         "stage": 0,
//         "max_STAGE": 0,
//         "progress": 0,
//         "memory_USED": 97816,
//         "max_MEMORY_USED": 216680,
//         "examined_ROWS": 0,
//         "tid": 1289485,
//         "user": "rouser",
//         "host": "localhost:39120",
//         "db": "clbrt",
//         "state": "Sending data",
//         "info_BINARY": "U0VMRUNUCioKRlJPTQp2eDFfYXJ0aWNsZQpXSEVSRQpsYW5ndWFnZV9pZCBJUyBOT1QgTlVMTApMSU1JVCAxMDAw"
//     }
// ]

const columns = [
    {type: "string", id: "Query"},
    {type: "date", id: "Start"},
    {type: "date", id: "End"},
];

function sortFunc(a, b) {
    const aDate = new Date(a.start).getTime()
    const bDate = new Date(b.start).getTime()
    if (aDate > bDate) {
        return -1
    } else {
        return 1
    }
    return 0
}

function filterFunc(query, filter) {
    const startDate = new Date(query.start).getTime()
    const stopDate = (query.stop !== null ? new Date(query.stop).getTime() : new Date().getTime())
    return stopDate - startDate >= filter * 1000
}

function getData(queries, filter) {
    let res = [columns]
    queries.filter(query => filterFunc(query, filter)).sort(sortFunc).map((query) => {
        if (query.stop === null) {
            query.stop = new Date()
        }
        res.push([query.query_ID + " " + query.info, new Date(query.start), new Date(query.stop)])
    })
    return res
}

export default function Processes({setTitle, setAlert, loggedIn}) {
    const [queries, setQueries] = useState(undefined)
    const [filter, setFilter] = useState(10)
    const [curTab, setCurTab] = useState(0)

    function updateQueries() {
        API.getProcesses((data) => {
            setQueries(data)
        }, (reason) => {
            setAlert(<Alert severity={"error"}>Server error!</Alert>)
        })
    }

    useEffect(() => {
        setTitle("Queries")
        updateQueries()
        const intervalId = setInterval(() => {
            updateQueries()
        }, 10000);

        return () => clearInterval(intervalId);
    }, [])

    return (
        <Box
            sx={{p: 2}}
        >
            {queries !== undefined
                ? <>
                    <Box pb={2}>
                        <TextField
                            label={"Filter by duration, sec"}
                            variant={"outlined"}
                            value={filter}
                            onChange={event => setFilter(event.target.value)}
                        />
                    </Box>
                    {getData(queries, filter).length > 1
                        ? <>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs value={curTab} onChange={(e, newVal) => setCurTab(newVal)}
                                      aria-label="basic tabs example">
                                    <Tab label="Graph"/>
                                    <Tab label="Table"/>
                                </Tabs>
                            </Box>
                            {curTab === 0
                                ? <Chart chartType="Timeline" data={getData(queries, filter)} width="100%"
                                         height="1800px"/>
                                : <MyTable queries={queries} filter={filter}/>
                            }
                        </>
                        : <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: "300px",
                                fontSize: "xxx-large",
                                fontWeight: "bold",
                                color: "lightgray"
                            }}
                        >
                            No data found
                        </Box>
                    }
                </>
                : <Backdrop open={true} sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
            }
        </Box>
    )
}