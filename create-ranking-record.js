const submitMessage = () => {
  if (userMessage.value == '')
    return
  createMessage(userMessage.value)
  console.log(messageBoardStore.messages);
  messageBoardStore.addNewMessageAndDisplayInstantly(userMessage.value)
  userMessage.value = ''
}

async function createMessage(userMessage) {
  try {
    await messageBoardStore.createMessageBackend(userMessage)

  } catch (error) {
    console.error(error);
  }
}
