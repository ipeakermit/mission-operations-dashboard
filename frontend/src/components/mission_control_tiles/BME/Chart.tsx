import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Line} from "react-chartjs-2";
import {ChartJSData, DataPoint} from "../../../types/chartjsData";
import {useSessionContext} from "../../../context/SessionContext";
import {DateTime} from "luxon";
import 'chartjs-adapter-luxon';
import {useSessionTime} from "../../../util/useSessionTime";

const useStyles = makeStyles({})

interface ChartProps {
    newData: number[];
}
const initialPoint: DataPoint = {x: '2019-11-15T14:55:00', y: 37.2};
const Chart: React.FC<ChartProps> = (props) => {
    const classes = useStyles();
    const sessionTime = useSessionTime();
    const [data, setData] = useState<ChartJSData>({
        datasets: [
            {
                data: [
                    initialPoint
                ],
                backgroundColor: "white",
                borderColor: "green",
                borderWidth: 2,
                fill: false
            }
        ]
    })

    useEffect(() => {
        let temps = props.newData;
        let data: DataPoint[] = temps.map((temp: number, index: number) => {
            return {
                x: DateTime.fromISO("2019-11-15T15:00:00").plus({seconds: 300*index}).toISO(),
                y: temp,
            }
        })
        setData({
            datasets: [
                {
                    data: [initialPoint, ...data],
                    backgroundColor: "white",
                    borderColor: "lime",
                    borderWidth: 2,
                    fill: false
                }
            ]
        })
    }, [props.newData])

    return (
        <Line
            data={data}
            redraw={false}
            options={{
                animation: {
                    duration: 0
                },
                //title: {
                //    display: false
                //},
                plugins: {
                    legend: {
                        display: false
                    },
                },
                scales: {
                    x: {
                        type: "time",
                        min: "2019-11-15T15:00:00",
                        max: "2019-11-15T16:45:00",
                        ticks: {
                            callback: function (value: any, index: any, values: any) {
                                return "";
                            }
                        },
                        grid: {
                            borderColor: "rgba(255,255,255,0.1)",
                            tickColor: "rgba(255,255,255,0)",
                            color: "rgba(255,255,255,0.1)",
                        }
                    },
                    y: {
                        min: 35.8,
                        max: 37.8,
                        ticks: {
                            color: "#FFFFFF",
                            stepSize: 0.2,
                        },
                        grid: {
                            borderColor: "rgba(255,255,255,0.2)",
                            tickColor: "rgba(255,255,255,0.2)",
                            color: "rgba(255,255,255,0.2)",
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    },
                    line: {
                        tension: 0
                    }
                },
                bezierCurve: false,
                mainAspectRation: false,
                responsive: true
            }}
            height={130}
            width={270}
        />
    )
}

export default Chart;
