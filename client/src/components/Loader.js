import React, { Component } from 'react'

const Loader = ({ color, size, delay }) => (
  <svg
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke={color}
      strokeWidth="3"
      r="35"
      strokeDasharray="164.93361431346415 56.97787143782138"
      transform="rotate(174 50 50)"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        calcMode="linear"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
        dur="1s"
        begin="0s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
)

class LoaderContainer extends Component {
  static defaultProps = {
    color: '#ddd',
    size: 100,
    delay: 500,
  }

  constructor(props) {
    super(props)

    if (this.props.delay > 0) {
      this.state = {
        hidden: true,
      }
    } else {
      this.state = {
        hidden: false,
      }
    }
  }

  componentDidMount() {
    if (this.props.delay > 0) {
      this.delay = setTimeout(() => {
        this.setState({
          hidden: false,
        })
      }, this.props.delay)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.delay)
  }

  render() {
    return <Loader {...this.props} hidden={this.state.hidden} />
  }
}

export default LoaderContainer
