import {User} from "./user";
import {Consoles} from "./consoles";

export type ChartJSData = {
    datasets: DataSet[]
}

export type DataPoint = {x: string, y: number}

type DataSet = {
    data: DataPoint[],
    backgroundColor: string,
    borderColor: string,
    borderWidth: number,
    fill: boolean
}