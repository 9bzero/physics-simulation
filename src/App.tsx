import{useRef,useEffect,useState,useCallback}from'react'
  interface Ball{x:number;y:number;vx:number;vy:number;r:number;color:string;mass:number}
  const COLORS=["#38bdf8","#22c55e","#f59e0b","#ef4444","#a855f7","#ec4899","#06b6d4","#84cc16"]
  const rnd=(a:number,b:number)=>Math.random()*(b-a)+a
  function makeBalls(n:number,W:number,H:number):Ball[]{return Array.from({length:n},()=>({x:rnd(30,W-30),y:rnd(30,H-30),vx:rnd(-3,3),vy:rnd(-3,3),r:rnd(10,22),color:COLORS[Math.floor(Math.random()*COLORS.length)],mass:1}))}
  export default function App(){
    const canvasRef=useRef<HTMLCanvasElement>(null)
    const ballsRef=useRef<Ball[]>([])
    const animRef=useRef<number>(0)
    const[gravity,setGravity]=useState(0.2)
    const[bounce,setBounce]=useState(0.8)
    const[count,setCount]=useState(12)
    const[running,setRunning]=useState(true)
    const gRef=useRef(gravity);const bRef=useRef(bounce);const rRef=useRef(running)
    gRef.current=gravity;bRef.current=bounce;rRef.current=running
    const init=useCallback(()=>{
      const c=canvasRef.current;if(!c)return
      ballsRef.current=makeBalls(count,c.width,c.height)
    },[count])
    useEffect(()=>{init()},[init])
    useEffect(()=>{
      const c=canvasRef.current;if(!c)return
      const ctx=c.getContext("2d")!
      const tick=()=>{
        animRef.current=requestAnimationFrame(tick)
        if(!rRef.current)return
        ctx.fillStyle="rgba(15,23,42,0.25)";ctx.fillRect(0,0,c.width,c.height)
        const W=c.width,H=c.height
        ballsRef.current.forEach(b=>{
          b.vy+=gRef.current;b.x+=b.vx;b.y+=b.vy
          if(b.x-b.r<0){b.x=b.r;b.vx=Math.abs(b.vx)*bRef.current}
          if(b.x+b.r>W){b.x=W-b.r;b.vx=-Math.abs(b.vx)*bRef.current}
          if(b.y-b.r<0){b.y=b.r;b.vy=Math.abs(b.vy)*bRef.current}
          if(b.y+b.r>H){b.y=H-b.r;b.vy=-Math.abs(b.vy)*bRef.current}
          const grad=ctx.createRadialGradient(b.x-b.r*0.3,b.y-b.r*0.3,b.r*0.1,b.x,b.y,b.r)
          grad.addColorStop(0,b.color+"dd");grad.addColorStop(1,b.color+"44")
          ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2)
          ctx.fillStyle=grad;ctx.fill()
        })
      }
      tick()
      return()=>cancelAnimationFrame(animRef.current)
    },[])
    const addBall=()=>{
      const c=canvasRef.current;if(!c)return
      ballsRef.current.push({x:c.width/2,y:50,vx:rnd(-3,3),vy:0,r:rnd(12,20),color:COLORS[Math.floor(Math.random()*COLORS.length)],mass:1})
    }
    return(
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",padding:"1.5rem"}}>
        <h1 style={{fontWeight:800,fontSize:"1.5rem",color:"#f8fafc"}}>⚽ Physics Simulation</h1>
        <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
          <button onClick={()=>setRunning(r=>!r)} style={{padding:"0.4rem 1rem",background:running?"#dc2626":"#22c55e",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:700,fontSize:"0.82rem"}}>{running?"Pause":"Resume"}</button>
          <button onClick={addBall} style={{padding:"0.4rem 1rem",background:"#0ea5e9",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:700,fontSize:"0.82rem"}}>+ Ball</button>
          <button onClick={init} style={{padding:"0.4rem 0.9rem",background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",borderRadius:6,cursor:"pointer",fontSize:"0.82rem"}}>Reset</button>
        </div>
        <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap",justifyContent:"center",fontSize:"0.82rem",color:"#94a3b8"}}>
          <label style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>Gravity <input type="range" min="0" max="1" step="0.05" value={gravity} onChange={e=>setGravity(+e.target.value)} style={{accentColor:"#38bdf8",width:80}}/> {gravity.toFixed(2)}</label>
          <label style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>Bounce <input type="range" min="0.3" max="1" step="0.05" value={bounce} onChange={e=>setBounce(+e.target.value)} style={{accentColor:"#22c55e",width:80}}/> {bounce.toFixed(2)}</label>
        </div>
        <canvas ref={canvasRef} width={640} height={400} style={{borderRadius:12,border:"1px solid #1e293b",maxWidth:"100%"}}/>
      </div>
    )
  }