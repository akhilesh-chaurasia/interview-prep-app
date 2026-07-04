import React from 'react'

const AnswerContainer = ({ answer, setAnswer }) => {
    return (
        <div className='answer-container'>
            <label htmlFor='answer-box' className='sr-only'>Your answer</label>
            <textarea
                id='answer-box'
                className='answer-box'
                rows={10}
                placeholder='Write your answer here...'
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onInput={(e) => {
                    e.target.style.height = "auto"
                    e.target.style.height = e.target.scrollHeight + "px"
                }}
                aria-label='Answer textbox'
            />
        </div>
    )
}

export default AnswerContainer