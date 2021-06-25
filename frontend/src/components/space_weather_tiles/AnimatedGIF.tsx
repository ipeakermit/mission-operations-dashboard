import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { AnimationBuilder } from 'util/AnimationBuilder';
import styled from 'styled-components';

interface AnimatedGIFProps {
  className?: string;
  id: string;
  url: string;
  width: number;
  height: number;
}

const AnimatedGIF: React.FC<AnimatedGIFProps> = (props) => {
  const [builder, setBuilder] = useState<AnimationBuilder>(new AnimationBuilder(props.url, props.id, props.width, props.height))

  useEffect(() => {
    builder.resize(props.width, props.height);
    builder.populateImages();
  }, [props.width, props.height])

  return (
    <canvas width={props.width} height={props.height} className={props.className} id={props.id}></canvas>
  )
}

const StyledAnimatedGIF = styled(AnimatedGIF)`
  width: 100%;
  height: 100%;
`;

export default StyledAnimatedGIF;