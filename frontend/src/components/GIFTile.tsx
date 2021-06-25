import axios from 'axios';
import React, {useState, useEffect} from 'react';
import ModuleTile from 'components/ModuleTile';
import AnimatedGIF from 'components/space_weather_tiles/AnimatedGIF';
import styled from 'styled-components';

interface GIFTileProps {
  className?: string;
  url: string;
  id: string;
}

const GIFTile: React.FC<GIFTileProps> = (props) => {
  const [width, setWidth] = useState<number>(200)
  const [height, setHeight] = useState<number>(200);

  const handleResize = (width: number, height: number) => {
    setWidth(width);
    setHeight(height);
  }

  return (
    <ModuleTile onResize={handleResize}>
      <AnimatedGIF id={props.id} url={props.url} width={width} height={height} />
    </ModuleTile>
  )
}

const StyledGIFTile = styled(GIFTile)``;

export default StyledGIFTile;