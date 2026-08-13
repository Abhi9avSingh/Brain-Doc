import { useEffect, useRef, useState } from 'react';
import { Brain, FileText, MessageSquare, Network, Shield, Zap } from 'lucide-react';

interface RuntimeRenderer {
  mode: 'webgpu' | 'webgl' | 'canvas';
  render: (time: number, progress: number, pointerX: number, pointerY: number) => void;
  resize: (width: number, height: number, dpr: number) => void;
  dispose: () => void;
}

const chapters = [
  { step: '01', eyebrow: 'Ingest', title: 'Fragments enter orbit.', copy: 'Reports, notes, and research arrive as separate objects—visible, legible, and still connected to their source.', icon: FileText },
  { step: '02', eyebrow: 'Understand', title: 'Meaning creates gravity.', copy: 'Semantic signals pull related ideas together. The core forms structure without hiding the original evidence.', icon: Brain },
  { step: '03', eyebrow: 'Connect', title: 'A living graph emerges.', copy: 'Themes, decisions, people, and contradictions become one navigable knowledge universe.', icon: Network },
  { step: '04', eyebrow: 'Answer', title: 'Insight returns with proof.', copy: 'Ask naturally. BrainDoc resolves the graph into a direct answer with citations you can verify.', icon: MessageSquare },
];

const vertexWGSL = `
@vertex fn vs_main(@builtin(vertex_index) index: u32) -> @builtin(position) vec4f {
  var p = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  return vec4f(p[index], 0.0, 1.0);
}`;

const fragmentWGSL = `
struct Uniforms { resolution: vec2f, time: f32, progress: f32, pointer: vec2f, quality: f32, pad: f32 }
@group(0) @binding(0) var<uniform> u: Uniforms;
fn hash(p: vec2f) -> f32 { return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453); }
@fragment fn fs_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  var uv = position.xy / u.resolution * 2.0 - 1.0;
  uv.x *= u.resolution.x / max(u.resolution.y, 1.0);
  let t = u.time * 0.00022;
  let phase = u.progress * 3.0;
  let pointer = (u.pointer - .5) * .16;
  let center = vec2f(sin(t * .7) * .035, cos(t * .55) * .025) + pointer;
  let q = uv - center;
  let radius = .20 + smoothstep(0.0, 1.0, u.progress) * .075;
  let d = length(q);
  let angle = atan2(q.y, q.x);
  let pulse = sin(t * 5.0 + phase * 2.2) * .008;
  let core = .018 / max(abs(d - radius - pulse), .008);
  let halo = .06 / max(d * d * 7.0, .04);
  let ringA = .015 / max(abs(d - radius * 1.8 - sin(angle * 5.0 + t) * .025), .012);
  let ringB = .01 / max(abs(d - radius * 2.45 - cos(angle * 3.0 - t * .8) * .035), .014);
  let cell = floor((uv + vec2f(t * .03, 0.0)) * 16.0);
  let starSeed = hash(cell);
  let cellUV = fract((uv + vec2f(t * .03, 0.0)) * 16.0) - .5;
  let stars = select(0.0, pow(max(0.0, .055 / max(length(cellUV), .018)), 1.35), starSeed > .91);
  let links = pow(max(0.0, sin(angle * 12.0 + d * 34.0 - t * 3.0)), 18.0) * smoothstep(.72, .18, abs(d - radius * 1.75));
  let lime = vec3f(.68, 1.0, .22);
  let cyan = vec3f(.24, .82, .95);
  let violet = vec3f(.51, .43, 1.0);
  let accent = mix(mix(lime, cyan, smoothstep(.18, .52, u.progress)), violet, smoothstep(.62, .94, u.progress));
  let bg = mix(vec3f(.008, .014, .013), vec3f(.018, .025, .055), smoothstep(.1, .9, u.progress));
  let energy = core * .7 + halo * .25 + ringA * smoothstep(.2, .55, u.progress) + ringB * smoothstep(.55, .9, u.progress) + links * .2 + stars * .055;
  let vignette = 1.0 - smoothstep(.65, 1.55, length(uv));
  return vec4f((bg + accent * energy) * (.38 + .62 * vignette), 1.0);
}`;

async function createWebGPU(canvas: HTMLCanvasElement): Promise<RuntimeRenderer | null> {
  const gpu = (navigator as Navigator & { gpu?: any }).gpu;
  if (!gpu) return null;
  try {
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) return null;
    const device = await adapter.requestDevice();
    const context = canvas.getContext('webgpu' as never) as any;
    if (!context) return null;
    const format = gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: 'opaque' });
    const shader = device.createShaderModule({ code: `${vertexWGSL}\n${fragmentWGSL}` });
    const pipeline = await device.createRenderPipelineAsync({
      layout: 'auto', vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format }] },
      primitive: { topology: 'triangle-list' },
    });
    const usage = (globalThis as any).GPUBufferUsage;
    const uniform = device.createBuffer({ size: 32, usage: usage.UNIFORM | usage.COPY_DST });
    const bindGroup = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: uniform } }] });
    let width = 1; let height = 1;
    return {
      mode: 'webgpu',
      resize(w, h, dpr) { width = Math.max(1, Math.floor(w * dpr)); height = Math.max(1, Math.floor(h * dpr)); canvas.width = width; canvas.height = height; },
      render(time, progress, px, py) {
        const values = new Float32Array([width, height, time, progress, px, py, 1, 0]);
        device.queue.writeBuffer(uniform, 0, values);
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({ colorAttachments: [{ view: context.getCurrentTexture().createView(), clearValue: { r: 0, g: 0, b: 0, a: 1 }, loadOp: 'clear', storeOp: 'store' }] });
        pass.setPipeline(pipeline); pass.setBindGroup(0, bindGroup); pass.draw(3); pass.end();
        device.queue.submit([encoder.finish()]);
      },
      dispose() { uniform.destroy(); device.destroy?.(); },
    };
  } catch { return null; }
}

const vertexGLSL = `#version 300 es\nin vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`;
const fragmentGLSL = `#version 300 es
precision mediump float; out vec4 outColor; uniform vec2 r; uniform float t; uniform float s; uniform vec2 m;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){vec2 uv=gl_FragCoord.xy/r*2.-1.;uv.x*=r.x/max(r.y,1.);float ti=t*.00022;vec2 q=uv-vec2(sin(ti*.7)*.035,cos(ti*.55)*.025)-(m-.5)*.16;float d=length(q);float a=atan(q.y,q.x);float rad=.2+smoothstep(0.,1.,s)*.075;float core=.018/max(abs(d-rad-sin(ti*5.+s*6.6)*.008),.008);float halo=.06/max(d*d*7.,.04);float ra=.015/max(abs(d-rad*1.8-sin(a*5.+ti)*.025),.012);float rb=.01/max(abs(d-rad*2.45-cos(a*3.-ti*.8)*.035),.014);vec2 cell=floor((uv+vec2(ti*.03,0.))*16.);vec2 cu=fract((uv+vec2(ti*.03,0.))*16.)-.5;float stars=hash(cell)>.91?pow(max(0.,.055/max(length(cu),.018)),1.35):0.;float links=pow(max(0.,sin(a*12.+d*34.-ti*3.)),18.)*smoothstep(.72,.18,abs(d-rad*1.75));vec3 lime=vec3(.68,1.,.22),cyan=vec3(.24,.82,.95),violet=vec3(.51,.43,1.);vec3 accent=mix(mix(lime,cyan,smoothstep(.18,.52,s)),violet,smoothstep(.62,.94,s));vec3 bg=mix(vec3(.008,.014,.013),vec3(.018,.025,.055),smoothstep(.1,.9,s));float energy=core*.7+halo*.25+ra*smoothstep(.2,.55,s)+rb*smoothstep(.55,.9,s)+links*.2+stars*.055;float v=1.-smoothstep(.65,1.55,length(uv));outColor=vec4((bg+accent*energy)*(.38+.62*v),1.);}`;

function createWebGL(canvas: HTMLCanvasElement): RuntimeRenderer | null {
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const compile = (type: number, source: string) => { const shader = gl.createShader(type)!; gl.shaderSource(shader, source); gl.compileShader(shader); if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader error'); return shader; };
  try {
    const program = gl.createProgram()!; const vs = compile(gl.VERTEX_SHADER, vertexGLSL); const fs = compile(gl.FRAGMENT_SHADER, fragmentGLSL);
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.bindAttribLocation(program, 0, 'p'); gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Link error');
    const buffer = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    gl.useProgram(program); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    const ur=gl.getUniformLocation(program,'r'), ut=gl.getUniformLocation(program,'t'), us=gl.getUniformLocation(program,'s'), um=gl.getUniformLocation(program,'m');
    return { mode:'webgl', resize(w,h,dpr){canvas.width=Math.max(1,Math.floor(w*dpr));canvas.height=Math.max(1,Math.floor(h*dpr));gl.viewport(0,0,canvas.width,canvas.height);}, render(time,progress,px,py){gl.useProgram(program);gl.uniform2f(ur,canvas.width,canvas.height);gl.uniform1f(ut,time);gl.uniform1f(us,progress);gl.uniform2f(um,px,1-py);gl.drawArrays(gl.TRIANGLES,0,3);}, dispose(){gl.deleteBuffer(buffer);gl.deleteShader(vs);gl.deleteShader(fs);gl.deleteProgram(program);} };
  } catch { return null; }
}

function createCanvasFallback(canvas: HTMLCanvasElement): RuntimeRenderer {
  const ctx = canvas.getContext('2d', { alpha: false })!;
  return { mode:'canvas', resize(w,h,dpr){canvas.width=Math.max(1,Math.floor(w*dpr));canvas.height=Math.max(1,Math.floor(h*dpr));}, render(time,progress){const w=canvas.width,h=canvas.height,cx=w*.5,cy=h*.5,rad=Math.min(w,h)*(.12+progress*.04);ctx.fillStyle='#070d0c';ctx.fillRect(0,0,w,h);const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rad*3.8);g.addColorStop(0,progress>.65?'#8170ff':'#baff61');g.addColorStop(.12,'rgba(112,230,196,.42)');g.addColorStop(1,'rgba(7,13,12,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);const count=42;for(let i=0;i<count;i++){const a=i*2.399+(time*.00003);const rr=rad*(.35+(i%9)/7);const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*.72;ctx.fillStyle=i%5===0?'#baff61':'rgba(205,226,255,.72)';ctx.beginPath();ctx.arc(x,y,Math.max(1,w/900)*(i%5===0?2.2:1),0,Math.PI*2);ctx.fill();}}, dispose(){} };
}

export function KnowledgeJourney() {
  const sectionRef = useRef<HTMLElement>(null); const canvasRef = useRef<HTMLCanvasElement>(null); const rendererRef = useRef<RuntimeRenderer | null>(null);
  const [mode, setMode] = useState<'loading'|'webgpu'|'webgl'|'canvas'>('loading');
  const [reduced, setReduced] = useState(() => localStorage.getItem('braindoc-reduced-effects') === 'true');

  useEffect(() => {
    const section=sectionRef.current, canvas=canvasRef.current; if(!section||!canvas)return;
    let disposed=false, frame=0, visible=false, progress=0, activeStage=-1, px=.5, py=.5, last=0, slowFrames=0;
    const mediaReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection;
    const memory=(navigator as Navigator & {deviceMemory?:number}).deviceMemory ?? 8;
    const lowPower=reduced||mediaReduced||connection?.saveData||memory<=4||navigator.hardwareConcurrency<=4;
    let dpr=Math.min(window.devicePixelRatio||1,lowPower?1:1.65);
    const resize=()=>rendererRef.current?.resize(section.clientWidth,window.innerHeight,dpr);
    const updateScroll=()=>{const rect=section.getBoundingClientRect();progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,section.offsetHeight-window.innerHeight)));section.style.setProperty('--journey-progress',String(progress));const next=Math.min(3,Math.floor(progress*4));if(next!==activeStage){activeStage=next;section.dataset.stage=String(next);section.querySelectorAll<HTMLElement>('.knowledge-chapter').forEach((el,i)=>el.dataset.active=String(i===next));}};
    const render=(time:number)=>{frame=0;if(!visible||document.hidden||!rendererRef.current)return;if(lowPower&&time-last<32){frame=requestAnimationFrame(render);return;}const start=performance.now();rendererRef.current.render(mediaReduced?0:time,progress,px,py);const cost=performance.now()-start;if(cost>10)slowFrames++;else slowFrames=Math.max(0,slowFrames-1);if(slowFrames>45&&dpr>1){dpr=Math.max(1,dpr-.25);slowFrames=0;resize();}last=time;frame=requestAnimationFrame(render);};
    const start=async()=>{let renderer:RuntimeRenderer|null=null;if(!lowPower)renderer=await createWebGPU(canvas);if(!renderer&&!reduced&&!mediaReduced)renderer=createWebGL(canvas);if(!renderer)renderer=createCanvasFallback(canvas);if(disposed){renderer.dispose();return;}rendererRef.current=renderer;setMode(renderer.mode);resize();updateScroll();if(visible&&!frame)frame=requestAnimationFrame(render);};
    const idle=(window as Window & {requestIdleCallback?:(cb:()=>void,o?:{timeout:number})=>number}).requestIdleCallback;
    const idleId=idle?idle(()=>void start(),{timeout:500}):window.setTimeout(()=>void start(),30);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){updateScroll();if(rendererRef.current&&!frame)frame=requestAnimationFrame(render);}else if(frame){cancelAnimationFrame(frame);frame=0;}},{rootMargin:'35% 0px'});observer.observe(section);
    const ro=new ResizeObserver(resize);ro.observe(section);
    const onScroll=()=>updateScroll();const onPointer=(e:PointerEvent)=>{px=e.clientX/window.innerWidth;py=e.clientY/window.innerHeight;};
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('pointermove',onPointer,{passive:true});
    return()=>{disposed=true;if(frame)cancelAnimationFrame(frame);if(idle)(window as any).cancelIdleCallback?.(idleId);else clearTimeout(idleId);observer.disconnect();ro.disconnect();window.removeEventListener('scroll',onScroll);window.removeEventListener('pointermove',onPointer);rendererRef.current?.dispose();rendererRef.current=null;};
  },[reduced]);

  const toggleReduced=()=>{setReduced(value=>{const next=!value;localStorage.setItem('braindoc-reduced-effects',String(next));return next;});};
  return <section ref={sectionRef} id="journey" className="knowledge-journey" aria-labelledby="journey-title" data-stage="0">
    <div className="knowledge-sticky">
      <canvas ref={canvasRef} className="knowledge-renderer" aria-hidden="true" />
      <div className="knowledge-render-fallback" aria-hidden="true"><Brain /></div>
      <div className="knowledge-scene-ui">
        <div className="knowledge-scene-label"><span>BD / LIVING KNOWLEDGE CORE</span><i>{mode==='loading'?'PREPARING':mode.toUpperCase()}</i></div>
        <div className="knowledge-stage-dots" aria-hidden="true">{chapters.map((item,index)=><span key={item.step} data-index={index} />)}</div>
        <div className="knowledge-scene-footer"><span>SCROLL TO EVOLVE</span><span><Zap /> adaptive renderer</span></div>
      </div>
    </div>
    <div className="knowledge-story">
      <header className="knowledge-intro">
        <span>01 / The central idea</span>
        <h2 id="journey-title">Watch scattered knowledge become intelligence.</h2>
        <p>One object. Four transformations. Every visual change explains what BrainDoc is doing with your information.</p>
      </header>
      {chapters.map((item,index)=>{const Icon=item.icon;return <article key={item.step} className="knowledge-chapter" data-active={index===0}>
        <div className="knowledge-chapter-meta"><span>{item.step}</span><Icon /></div><p>{item.eyebrow}</p><h3>{item.title}</h3><div className="knowledge-chapter-line" /><p>{item.copy}</p>{index===3&&<div className="knowledge-proof"><Shield /> Sources remain attached at every step.</div>}
      </article>;})}
    </div>
    <button className="knowledge-effects-toggle" onClick={toggleReduced} aria-pressed={reduced}>{reduced?'Enable full effects':'Reduce effects'}<small>{mode==='loading'?'Detecting renderer':`${mode.toUpperCase()} active`}</small></button>
    <span className="sr-only" aria-live="polite">Knowledge journey renderer: {mode}. Reduced effects {reduced?'enabled':'disabled'}.</span>
  </section>;
}
