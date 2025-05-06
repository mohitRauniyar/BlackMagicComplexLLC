import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="bar">
        <div className="ball" />
      </div>
      <h1 className="mt-8 text-2xl"><i>Loading...</i></h1>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  background-color: black; /* optional for contrast */
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;

  .ball {
    position: relative;
    bottom: 50px;
    left: calc(100% - 20px);
    width: 50px;
    height: 50px;
    background: #fff;
    border-radius: 50%;
    animation: ball-move8234 3s ease-in-out 1s infinite alternate;
  }

  .ball::after {
    position: absolute;
    content: '';
    top: 25px;
    right: 5px;
    width: 5px;
    height: 5px;
    background: #000;
    border-radius: 50%;
  }

  .bar {
    width: 200px;
    height: 12.5px;
    background: #FFDAAF;
    border-radius: 30px;
    transform: rotate(-15deg);
    animation: up-down6123 3s ease-in-out 1s infinite alternate;
  }

  @keyframes up-down6123 {
    from {
      transform: rotate(-15deg);
    }

    to {
      transform: rotate(15deg);
    }
  }

  @keyframes ball-move8234 {
    from {
      left: calc(100% - 40px);
      transform: rotate(360deg);
    }

    to {
      left: calc(0% - 20px);
      transform: rotate(0deg);
    }
  }
`;

export default Loader;
