const PORT=process.env.PORT||8900;
const io=require('socket.io')(PORT,{
    cors:{
        origin:'*'
    }
})
let users=[]
const addUsers=(userId,socketId)=>{
    
    !users.some((user)=>user.userId===userId)&&
    users.push({userId,socketId})
}
const removeUser=(socketId)=>{
    users=users.filter((user)=>user.socketId!==socketId)
    
}
const getUsers=(userId)=>{
      return users.find((user)=>user.userId==userId)
}
io.on('connection',(socket)=>{
    console.log('user-connected')
    socket.on('addUsers',(userId)=>{
        
        addUsers(userId,socket.id)
        io.emit('getUsers',users)
    })
    socket.on('sendMessage',({senderId,receiverId,text})=>{
        console.log(text)
        const user=getUsers(receiverId);
        console.log(users)
        if( user?.socketId){
            io.to(user.socketId).emit('getMessage',{senderId,text})
        }
        
    })
    socket.on('disconnect',()=>{
        console.log('user is disconnected')
        removeUser(socket.id)
        io.emit('getUsers',users)
    })
})