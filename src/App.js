import React, { Component } from 'react';
import './App.css';

const BookButton = props => {
  return <button className="book-btn">Book Now</button>;
};

const JoinWaitlist = props => {
  return <button className="waitlist-btn">Join Waitlist</button>;
};

const Event = class extends React.Component {
  constructor() {
    super();
  }
  state = { showDescription: false };
  toggleBody = () => {
    this.setState({ showDescription: !this.state.showDescription });
  };
  render() {
    const { event } = this.props;

    return (
      <article className="event">
        <h2 className="event-title">
          <span>{event.title}</span>
        </h2>
        <h3 className="event-date">
          <span>{event.event_date}</span>
        </h3>
        <div className="event-body">
          <picture>
            <img
              src="https://placeimg.com/480/270/people"
              alt={event.business_name}
            />
          </picture>
          <div
            className={`event-description${
              this.showDescription ? ' show' : ''
            }`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: event.description }}
              style={{
                display: `${this.state.showDescription ? 'block' : 'none'}`
              }}
            />
            <button onClick={this.toggleBody}>
              {this.state.showDescription
                ? 'Hide Description'
                : 'Show Description'}
            </button>
          </div>
        </div>
        <div className="meeting-place">
          <h3>{event.meeting_point}</h3>
        </div>
        <div className="event-meta">
          <p className="event-cost">
            &pound;
            {event.price}
          </p>
          {/*<p className="event-males">{event.male_available}</p>
        <p className="event-females">{event.male_available}</p> */}
        </div>
        {event.tickets_sold < event.tickets_available ? (
          <BookButton />
        ) : event.allow_waitlist === 1 ? (
          <JoinWaitlist />
        ) : (
          <p className="soldout-text">Sold Out</p>
        )}
      </article>
    );
  }
};

class App extends Component {
  state = {
    eventsLoaded: false
  };

  loadEvents = async () => {
    const events = await fetch('https://dash.dating-options.co.uk/v1/events', {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    const response = await events.json();
    this.setState({ eventsLoaded: true, events: response.data });
  };

  componentWillMount() {
    if (this.state.eventsLoaded === false) {
      this.loadEvents();
    }
  }
  renderEvents = () => {
    return this.state.events.map(event => (
      <Event key={`eventid-${event.id}`} event={event} />
    ));
  };
  render() {
    return (
      <section className="events">
        {this.state.eventsLoaded ? (
          this.renderEvents()
        ) : (
          <span className="event-loader">Loading</span>
        )}
      </section>
    );
  }
}

export default App;
