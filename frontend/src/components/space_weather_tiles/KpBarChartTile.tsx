import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { DataType } from 'types/noaa-planetary-k-index-3h';
import axios from 'axios';
import ModuleTile from 'components/ModuleTile';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { DateTime } from 'luxon';

interface KpBarChartTileProps {
  className?: string;
  url: string;
  numMostRecent: number;
}

const KpBarChartTile: React.FC<KpBarChartTileProps> = (props) => {
  const [data, setData] = useState<DataType[]>([]);
  const [width, setWidth] = useState<number>(200)
  const [height, setHeight] = useState<number>(200);

  useEffect(() => {
    updateData();
    const interval = setInterval(() => {
      updateData();
    }, 60001)
    return () => clearInterval(interval);
  }, [])

  const updateData = () => {
    axios.get(props.url).then((res) => {
      if (Array.isArray(res.data)) {
        let newData = res.data.slice(res.data.length - props.numMostRecent).map((datum) => {
          return (
            {
              timestamp: DateTime.fromSQL(datum[0]).toFormat("MMM d"),
              kp: parseInt(datum[1])
            }
          )
        })
        setData(newData);
      }
    })
  }

  const handleResize = (width: number, height: number) => {
    setWidth(width);
    setHeight(height);
  }

  const barColour = (value: number) => {
    if (value >= 0 && value < 4) {
      return "#22BB00"
    } else if (value === 4) {
      return "#FFCC00"
    } else if (value > 4) {
      return "#FF0000"
    }
  }

  return (
    <ModuleTile 
      className={props.className} 
      onResize={handleResize} 
      minSize={{height: 200}}
      defSize={{width: 400}}
    >
      <h3>3-Hourly Kp Index</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            bottom: 10
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            interval={7} 
            dataKey="timestamp" 
            tickMargin={5}
          />
          <YAxis 
            domain={[0,9]}
            tickCount={10}
          />
          <Bar dataKey="kp">
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColour(entry.kp)} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ModuleTile>
  )
}

const StyledKpBarChartTile = styled(KpBarChartTile)`
  font-family: 'Nunito Sans', sans-serif;

  h3 {
    font-family: 'Nunito Sans', sans-serif;
    margin: 0px;
  }
`;

export default StyledKpBarChartTile;