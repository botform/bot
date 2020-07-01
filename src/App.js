import React,{useState,useEffect,useRef} from 'react';
import { useDynamicList } from 'ahooks';
import './App.css';
import { 
  ThemeProvider,
  FixedWrapper,
  TitleBar,
  MessageGroup,
  Message,
  MessageTitle,
  MessageText,
  Avatar,
  IconButton,
  CloseIcon,
  TextComposer,
  Row,
  TextInput,
  SendButton
} from '@livechat/ui-kit';
const theme = {
  vars: {
      'primary-color': '#427fe1',
      'secondary-color': '#fbfbfb',
      'tertiary-color': '#fff',
      'avatar-border-color': 'blue',
  },
  AgentBar: {
      Avatar: {
          size: '42px',
      },
      css: {
          backgroundColor: 'var(--secondary-color)',
          borderColor: 'var(--avatar-border-color)',
      }
  },
  Message: {
      css: {
          fontWeight: 'bold',
      },
  },
  MessageText:{
    css:{
      background: '#ccc',
      borderRadius: '10px'
    }
  },
  TitleBar:{
    css:{
      position: 'fixed',
      padding:'10px 0px 10px 0px'
    }
  },
  TextComposer:{
    css:{
      position: 'fixed',
      left: '0',
      right: '0',
      bottom: '0'
    }
  }
}
function Bot(props){
  return(
    <Row>
      <Avatar imgUrl={props.avatar}/>
      <Message  authorName={props.name}>
        <MessageText>{props.text}</MessageText>
      </Message>
    </Row>
  )
}
function Guest(props){
  return(
    <Message isOwn authorName={props.name}>
      <MessageText>{props.text}</MessageText>
    </Message>
  )
}
function App() {
  const { list, remove, getKey, push } = useDynamicList([]);
  const [text,setText]=useState(null);
  const [typing,setTpying]=useState('Chat test');
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(scrollToBottom, [list]);
  const botSay=text=>{
    push({
      avatar:"/logo.jpeg",
      name:'bot',
      text:text,
      time:Date.now(),
      isOwn:false
    });
  }
  const send = text => {
    push({
      avatar:null,
      name:'Guest',
      text:text,
      time:Date.now(),
      isOwn:true
    });
    setTpying('typing...');
    setTimeout(() => {
      botSay(text);
      setTpying('Chat test');
    }, 1000);
  }

  return (
      <ThemeProvider theme={theme}>
        <TitleBar
          title={typing}
          rightIcons={[
            <IconButton key="close">
              <CloseIcon />
            </IconButton>,
          ]}
        />
        <div className="App">
          {
            list.map((item)=>{
              return(
                <div key={item.time}>
                {item.isOwn?<Guest name={item.name} text={item.text} />:<Bot name={item.name} avatar={item.avatar} text={item.text} />}
                </div>
              )
            })
          }
          <div ref={messagesEndRef} />
        </div>
        <TextComposer onSend={send}>
          <Row align="center">
            <TextInput />
            <SendButton fit />
          </Row>
        </TextComposer>
      </ThemeProvider>
  );
}

export default App;
