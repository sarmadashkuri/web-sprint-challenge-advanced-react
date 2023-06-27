import React from 'react'
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

// const initialState = {
//   message: initialMessage,
//   email: initialEmail,
//   index: initialIndex,
//   steps: initialSteps,
// }

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  state = {
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
  };

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const { index } = this.state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return [x, y];
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const [x, y] = this.getXY();
    return `Coordinates (${x}, ${y})`;
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    });
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const { index } = this.state;
    let nextIndex = index;

    if (direction === 'left') {
      if (index % 3 !== 0) {
        nextIndex = index - 1;
      }
    } else if (direction === 'up') {
      if (index >= 3) {
        nextIndex = index - 3;
      }
    } else if (direction === 'right') {
      if (index % 3 !== 2) {
        nextIndex = index + 1;
      }
    } else if (direction === 'down') {
      if (index < 6) {
        nextIndex = index + 3;
      }
    }

    return nextIndex;
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);

    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: nextIndex,
        steps: prevState.steps + 1,
        message: initialMessage,
      }));
    } else {
      this.setState({
        message: `You can't go ${direction}`,
      })
    }
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    const newEmail = evt.target.value;
    this.setState({ email: newEmail });
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const { email } = this.state;
    const { steps } = this.state;
    const [x, y] = this.getXY();
    axios.post('http://localhost:9000/api/result', { email, x, y, steps})
    .then((res) => {
      this.setState({ message: res.data.message, email: initialEmail });
    })
    .catch((error) => this.setState( {message: error.response.data.message }))
  }
  render() {
    const { className } = this.props
    const { email, index, steps, message } = this.state;
    const coordinates = this.getXYMessage();
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{coordinates}</h3>
          <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
                {idx === index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
