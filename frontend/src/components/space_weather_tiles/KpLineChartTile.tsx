import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { DataType } from 'types/noaa-planetary-k-index-3h';
import axios from 'axios';
import ModuleTile from 'components/ModuleTile';
import { Line, LineChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { DateTime } from 'luxon';

interface KpLineChartTileProps {
  className?: string;
  url: string;
}

const KpLineChartTile: React.FC<KpLineChartTileProps> = (props) => {
  const [data, setData] = useState<DataType[]>([]);
  const [width, setWidth] = useState<number>(200)
  const [height, setHeight] = useState<number>(200);

  useEffect(() => {
    updateData();
    const interval = setInterval(() => {
      updateData();
    }, 60001);
    return () => clearInterval(interval);
  }, [])

  const updateData = () => {
    axios.get(props.url).then((res) => {
      if (Array.isArray(res.data)) {
        let newData = res.data.map((datum) => {
          return (
            {
              timestamp: DateTime.fromISO(datum.time_tag).toFormat("HH:mm"),
              kp: datum.kp_index
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
      <h3>Per-Minute Kp Index</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            bottom: 10
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickMargin={5}
            minTickGap={10}
          />
          <YAxis 
            domain={[0,9]}
            tickCount={10}
          />
          <Line 
            dataKey="kp" 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ModuleTile>
  )
}

const StyledKpLineChartTile = styled(KpLineChartTile)`
  font-family: 'Nunito Sans', sans-serif;

  h3 {
    font-family: 'Nunito Sans', sans-serif;
    margin: 0px;
  }
`;

export default StyledKpLineChartTile;