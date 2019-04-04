import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";

import { withAuthorization, withEmailVerification } from "../Session";
import { withFirebase } from "../Firebase";
import { Typography } from "antd";
import Layout from "../Layout/index";

const { Title } = Typography;
const Message = () => (
  <Layout>
    <Title level={2}>Home</Title>
    <p>All projects will display in here</p>
    <Messages />
  </Layout>
);

class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      loading: false,
      messages: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase
      .messages()
      .orderByChild("createdAt")
      .on("value", snapshot => {
        const messageObject = snapshot.val();

        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key
          }));

          this.setState({ messages: messageList, loading: false });
        } else {
          this.setState({ messages: null, loading: false });
        }
      });
  }

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP
    });

    this.setState({ text: "" });

    event.preventDefault();
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onEditMessage = (message, text) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP
    });
  };

  render() {
    const { text, messages, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading && <div>Loading ...</div>}

            {messages ? (
              <MessageList
                messages={messages}
                onEditMessage={this.onEditMessage}
                onRemoveMessage={this.onRemoveMessage}
              />
            ) : (
              <div>There are no messages ...</div>
            )}
            <form onSubmit={event => this.onCreateMessage(event, authUser)}>
              <input type="text" value={text} onChange={this.onChangeText} />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const MessageList = ({ messages, onEditMessage, onRemoveMessage }) => (
  <ul>
    {messages.map(message => (
      <MessageItem
        key={message.uid}
        message={message}
        onEditMessage={onEditMessage}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </ul>
);

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text
    };
  }
  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text
    }));
  };
  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };
  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);

    this.setState({ editMode: false });
  };
  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <span>
            <strong>{message.userId}</strong> {message.text}
            {message.editedAt && <span>(Edited)</span>}
          </span>
        )}
        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </span>
        ) : (
          <button onClick={this.onToggleEditMode}>Edit</button>
        )}
        {!editMode && (
          <button type="button" onClick={() => onRemoveMessage(message.uid)}>
            Delete
          </button>
        )}
      </li>
    );
  }
}
const mapStateToProps = state => ({
  users: state.userState.users
});

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: "USERS_SET", users })
});

const Messages = withFirebase(MessagesBase);
const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withEmailVerification,
  withAuthorization(condition)
)(Message);
