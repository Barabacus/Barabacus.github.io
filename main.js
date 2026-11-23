(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursor = document.getElementById('cursor');
  if (cursor && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', e => {
      cursor.style.opacity = '1';
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.width='34px'; cursor.style.height='34px'; });
      el.addEventListener('mouseleave', () => { cursor.style.width='12px'; cursor.style.height='12px'; });
    });
  }

  if (!reduceMotion && window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-copy > *', {y:35, opacity:0, duration:1, stagger:.12, ease:'power3.out', delay:.2});
    gsap.utils.toArray('.reveal').forEach(el => gsap.from(el,{y:55,opacity:0,duration:1,scrollTrigger:{trigger:el,start:'top 82%'}}));
    gsap.utils.toArray('.work-card').forEach((el,i) => gsap.from(el,{y:45,opacity:0,duration:.8,delay:i*.08,scrollTrigger:{trigger:el,start:'top 88%'}}));
    gsap.to('.orb-wrap',{y:-90,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  }

  // A lightweight 3D form. If WebGL is unavailable, the CSS background remains.
  const host = document.getElementById('orb');
  if (host && window.THREE) {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, host.clientWidth/host.clientHeight, .1, 100);
      camera.position.z = 5;
      const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.setSize(host.clientWidth,host.clientHeight);
      host.appendChild(renderer.domElement);
      const geometry = new THREE.IcosahedronGeometry(1.25,5);
      const material = new THREE.MeshPhysicalMaterial({color:0x263f91,metalness:.68,roughness:.22,wireframe:false,clearcoat:1,clearcoatRoughness:.18});
      const mesh = new THREE.Mesh(geometry,material);
      scene.add(mesh);
      const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.29,2),new THREE.MeshBasicMaterial({color:0xd9ff35,wireframe:true,transparent:true,opacity:.22}));
      scene.add(wire);
      const acidLight = new THREE.PointLight(0xd9ff35,3,10); acidLight.position.set(2,2,3); scene.add(acidLight);
      const light = new THREE.PointLight(0x466cff,5,10); light.position.set(-3,-2,3); scene.add(light);
      let mx=0,my=0;
      window.addEventListener('mousemove',e=>{mx=(e.clientX/innerWidth-.5)*.5;my=(e.clientY/innerHeight-.5)*.5;});
      const render=()=>{
        if(!reduceMotion){mesh.rotation.y+=.0025;mesh.rotation.x+=.0015;wire.rotation.y-=.0018;mesh.rotation.x+=(my-mesh.rotation.x)*.008;mesh.rotation.y+=(mx-mesh.rotation.y)*.008;}
        renderer.render(scene,camera);requestAnimationFrame(render);
      }; render();
      window.addEventListener('resize',()=>{camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);});
    } catch(e) { console.info('3D fallback active',e); }
  }

  // Sound is opt-in; a quiet synthesized tone responds to the toggle.
  const toggle=document.getElementById('soundToggle'), label=document.getElementById('soundLabel');
  let audioContext=null, oscillator=null, gain=null;
  toggle?.addEventListener('click',()=>{
    const enabled=toggle.getAttribute('aria-pressed')!=='true';
    toggle.setAttribute('aria-pressed',String(enabled));
    label.textContent=enabled?'SOUND ON':'SOUND OFF';
    if(enabled){
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(!AudioCtx)return;
      audioContext ||= new AudioCtx();
      audioContext.resume();
      oscillator=audioContext.createOscillator(); gain=audioContext.createGain();
      oscillator.type='sine'; oscillator.frequency.value=55; gain.gain.value=.012;
      oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start();
    }else if(oscillator){gain.gain.setTargetAtTime(0,audioContext.currentTime,.08);oscillator.stop(audioContext.currentTime+.3);oscillator=null;}
  });
})();