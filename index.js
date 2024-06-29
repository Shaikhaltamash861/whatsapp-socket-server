const PORT=process.env.PORT|| 8900;
const express=require('express')
const app=express()
const cors =require('cors')
app.use(cors())
app.get('/',(req,res)=>res.send('Socket is live'))
const server=require('http').createServer(app)
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

// server.listen(PORT,()=>console.log(`Socket server is live on ${PORT}`))