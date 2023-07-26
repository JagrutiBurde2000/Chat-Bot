const sendChatBtn=document.querySelector('.chat-input span')
const chatInput=document.querySelector(".chat-input textarea")
const chatbox=document.querySelector(".chatbox")
const chatBotToggler=document.querySelector(".chatbot-toggler")
const chatbotCloseBtn=document.querySelector(".close-btn")


let userMessage;
const API_KEY="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";

const inputInitHeight=chatInput.scrollHeight;
const createChatLi=(message, className)=>{
   const chatLi= document.createElement("li")
   chatLi.classList.add("chat", className);
   let chatContent=className==="outgoing"? `<p>${message}</p>`: `  <span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`
chatLi.innerHTML=chatContent;
return chatLi;

}
// https://platform.openai.com/docs/api-reference/chat
const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: userMessage },
            ],
        }),
    };

    // Send POST request to API and get response
    fetch(API_URL, requestOptions)
        .then((res) => res.json())
        .then((data) => {
            // Update the messageElement with the API response
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((err) => {
            messageElement.classList.add("error")
            messageElement.textContent = "Oops! Something went wrong. Please try again!";
        }).finally(()=>{
            chatbox.scrollTo(0,chatbox.scrollHeight)
            // chatInput.value=""
        })
};


const handleChat=()=>{
userMessage=chatInput.value.trim();
console.log(userMessage)

if(!userMessage){
    return;
}

chatInput.value="";
chatInput.style.height=`${inputInitHeight}`
//apend the users message to the chatbox
     chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    
     setTimeout(()=>{

        //Display Thinking...... message while waiting for the response
        const incomingChatLi=createChatLi("Thinking.....","incoming")
        chatbox.appendChild(incomingChatLi);

        generateResponse(incomingChatLi);
     },600)
}

chatInput.addEventListener("input",()=>{

    //Adjust the height of the input textarea based on its content
   chatInput.style.height=`${inputInitHeight}px` 
   chatInput.style.height=`${chatInput.scrollHeight}px`
})
chatInput.addEventListener("keydown",(e)=>{
   
// If Enter key is pressed without Shift and window key
//width is greater that 800px, handle the chat
   if(e.key==="Enter" && !e.shiftKey && window.innerWidth>800){
    e.preventDefault();
    handleChat();
   }
})


chatbotCloseBtn.addEventListener("click",()=>{
    document.body.classList.remove("show-chatbot")
})
chatBotToggler.addEventListener("click",()=>{
    document.body.classList.toggle("show-chatbot")
})
sendChatBtn.addEventListener("click",handleChat)