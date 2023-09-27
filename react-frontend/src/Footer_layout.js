import { useState } from 'react';
import React from 'react';
import './Footer.css';
import axios from 'axios';
import sendButtonImage from './sent.png';
import questionImage from './question.png';
import answerImage from './answer.png';

function Footer_layout({ userData, Files }) {
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState('');
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const userId = userData.id;


    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuestion(inputValue);
        setIsInputEmpty(inputValue.trim() === '');

    };

    const handleSubmit = () => {
        // setIsInputEmpty(inputValue.trim() === '');
        if (question.trim() !== '') {
            setIsButtonClicked(true);
            console.log("footer Files:", userId, Files, question);
            const request_obj = {
                userId: userId,
                file_list: Files,
                question: question,
              };
            axios
                .post(`http://localhost:8000/answer/`, request_obj)
                .then((response) => {
                    const answerData = response.data;
                    const newMessages = [
                        {
                            user: 'User',
                            text: question,
                            className: 'user-message',
                            image: questionImage,
                        },
                    ];
            
                    for (const filename in answerData) {
                        if (answerData.hasOwnProperty(filename)) {
                            const answer = answerData[filename];
                            newMessages.push({
                                user: 'AI',
                                text: `${filename}:`,
                                text2 : `${answer}`,
                                className: 'ai-message',
                                image: answerImage,
                            });
                        }
                    }
            
                    setMessages(newMessages);
                    setQuestion('');
                    setIsInputEmpty(true);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            setTimeout(() => {
                setIsButtonClicked(false);
            }, 1000);
        }
    };

    return (
        <>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.className}`}>
                        <img src={message.image} alt={message.user} className="message-image" />
                        <strong>{message.text}</strong>
                        <br/>{message.text2}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="message-input"
                    value={question}
                    name="question"
                    onChange={handleInputChange}
                />
                <button
                    className={`send-button ${isButtonClicked ? 'clicked-button' : ''}`}
                    onClick={handleSubmit}
                    style={{ backgroundColor: isInputEmpty ? '' : 'rgb(25, 195, 125)' }}
                    disabled={!question.trim()}
                >
                    <img src={sendButtonImage} alt="Send" />
                </button>
            </div>
        </>
    );
}

export default Footer_layout;
