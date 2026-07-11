/**
 * Inline script that applies the saved/system theme before first paint,
 * preventing a flash of the wrong theme. Light-first: defaults to light
 * unless the user previously chose dark or has no stored pref + OS dark.
 */
export function ThemeScript() {
  const code = `(function(){try{
    var s=localStorage.getItem('theme');
    var d=s==='dark'||(s===null&&window.matchMedia('(prefers-color-scheme: dark)').matches);
    if(d)document.documentElement.classList.add('dark');
  }catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
