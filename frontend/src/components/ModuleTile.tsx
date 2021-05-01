import React, {useState} from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';

interface ModuleTileProps {
  className?: string;
  gridSize?: number;
  defPos?: {x: number, y: number};
  defSize?: {width: number, height: number};
}

const DEFAULT_GRID = 100;

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #DDDDDD",
  background: "#F0F0F0"
}

const ModuleTile: React.FC<ModuleTileProps> = (props) => {
  const [x, setPosX] = useState<number>(props.defPos?.x || 0);
  const [y, setPosY] = useState<number>(props.defPos?.y || 0);
  const [width, setWidth] = useState<number>(props.defSize?.width || 200);
  const [height, setHeight] = useState<number>(props.defSize?.height || 200);

  return (
    <Rnd className={props.className}
      style={style}
      size={{width: width, height: height}}
      position={{x: x, y: y}}
      onDragStop={(_e, drag) => {
        setPosX(Math.round(drag.x/(props.gridSize || DEFAULT_GRID))*(props.gridSize || DEFAULT_GRID));
        setPosY(Math.round(drag.y/(props.gridSize || DEFAULT_GRID))*(props.gridSize || DEFAULT_GRID));
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        if (!isNaN(parseInt(ref.style.width))) setWidth(parseInt(ref.style.width));
        if (!isNaN(parseInt(ref.style.height))) setHeight(parseInt(ref.style.height));
        setPosX(position.x);
        setPosY(position.y);
      }}
      resizeGrid={[props.gridSize || DEFAULT_GRID, props.gridSize || DEFAULT_GRID]}
      dragGrid={[props.gridSize || DEFAULT_GRID, props.gridSize || DEFAULT_GRID]}
      bounds="window"
    >
      {props.children}
    </Rnd>
  )
}

const StyledModuleTile = styled(ModuleTile)``;

export default StyledModuleTile;