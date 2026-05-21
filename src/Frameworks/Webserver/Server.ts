import {Server} from 'http';
import configKeys from '../../Config';

const serverConfig=(server:Server)=>{
    const startServer=()=>{
        server.listen(configKeys.PORT,()=>{
            console.log(`Server listening on Port  http://localhost:${configKeys.PORT}`);
            
        }).on("error", (err: NodeJS.ErrnoException) => {
            if (err.code === "EADDRINUSE") {
                console.error(
                    `Port ${configKeys.PORT} is already in use. Stop the other process (e.g. netstat -ano | findstr :${configKeys.PORT}) or change PORT in .env.`
                );
            } else {
                console.error("Server failed to start:", err.message);
            }
            process.exit(1);
        });
    }
    return {
        startServer
    }
}
export default serverConfig
