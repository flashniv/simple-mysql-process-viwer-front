import React from 'react';
import {Box} from "@mui/material";

function filterFunc(query, filter) {
    const startDate = new Date(query.start).getTime()
    const stopDate = (query.stop !== null ? new Date(query.stop).getTime() : new Date().getTime())
    return stopDate - startDate >= filter * 1000
}

function getTime(query){
    const startDate = new Date(query.start).getTime()
    const stopDate = (query.stop !== null ? new Date(query.stop).getTime() : new Date().getTime())
    return stopDate - startDate
}

const row = {
    display: "flex",
    flexDirection: "row",
    border: "1px solid lightgray"
}

const IDcol = {
    p: 1,
    minWidth: "150px"
}
const TimeCol = {
    p: 1,
    minWidth: "250px"
}
const QueryCol = {
    p: 1
}

export default function MyTable({queries, filter}) {
    console.log(queries.filter(query => filterFunc(query, filter)))
    return (
        <Box>
            <Box sx={row}>
                <Box sx={{...IDcol, fontWeight: "bold"}}>ID</Box>
                <Box sx={{...TimeCol, fontWeight: "bold"}}>Time s</Box>
                <Box sx={{...QueryCol, fontWeight: "bold"}}>Query</Box>
            </Box>
            {queries.filter(query => filterFunc(query, filter)).sort((a,b)=>getTime(b)-getTime(a)).map(query =>
                <Box sx={row}>
                    <Box sx={IDcol}>{query.query_ID}</Box>
                    <Box sx={TimeCol}>{getTime(query)/1000}</Box>
                    <Box sx={QueryCol}>{query.info}</Box>
                </Box>
            )}
        </Box>
    )
}