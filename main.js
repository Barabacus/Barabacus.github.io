(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-title > *',{y:32,opacity:0,duration:1,stagger:.14,ease:'power3.out',delay:.15});
    gsap.utils.toArray('.statement,.work,.project').forEach(el=>{
      gsap.from(el,{y:34,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 86%'}});
    });
    gsap.to('.specimen',{y:-65,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  }
  const sound=document.getElementById('sound');
  let ctx=null,osc=null,gain=null;
  sound?.addEventListener('click',()=>{
    const on=sound.getAttribute('aria-pressed')!=='true';
    sound.setAttribute('aria-pressed',String(on));
    sound.innerHTML=`<span></span> SOUND ${on?'ON':'OFF'}`;
    if(on){
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      ctx ||= new AC();ctx.resume();osc=ctx.createOscillator();gain=ctx.createGain();
      osc.type='sine';osc.frequency.value=48;gain.gain.value=.009;osc.connect(gain);gain.connect(ctx.destination);osc.start();
    } else if(osc){gain.gain.setTargetAtTime(0,ctx.currentTime,.06);osc.stop(ctx.currentTime+.25);osc=null;}
  });
})();