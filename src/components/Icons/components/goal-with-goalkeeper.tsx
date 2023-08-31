// Downloaded from: https://www.svgrepo.com/svg/322437/goal-keeper
// Used svgr to adapt it to react: https://react-svgr.com/playground/

export function GoalWithGoalkeeperIcon({ width = 128, height = 128, ...props }: React.SVGProps<SVGSVGElement>) {
  props["aria-description"] ??= "Goalkeeper is in the goal";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 512 512" {...props}>
      <path d="M18 78v414h36V114h404v378h36V78H18zm101 53v48H71.75v18H119v46H71.75v18H119v46H71.75v18H119v46H71.75v18H119v46H71.75v18H209.6c-.4-6-.9-12-1.3-18H201v-23.4h-.8l-17.2.3V435h-46v-46h42c.4-6 .8-12 1.4-18H137v-46h46v22c.2-1.9.4-3.9.6-5.6 1.8-17.1 6.6-35.5 17.4-49.1V261h8.5c-.9-6-1.2-12-.3-18H201v-46h43.4c3.6-1.2 7.5-1.9 11.4-2 4.5-.1 8.9.6 13.2 2h42v46h-8.7c.7 6 .6 12.1-.2 18h8.9v28.6c2.6 2.9 4.8 6 6.6 9.4 5.9 11.7 9.3 23.9 11.4 36.5V325h46v46h-43.1c.2 6 .2 12 .3 18H375v46h-46v-23.4h-18V435h-6l-1.2 18H441v-18h-48v-46h48v-18h-48v-46h48v-18h-48v-46h48v-18h-48v-46h48v-18h-48v-48h-18v48h-46v-48h-18v48h-46v-48h-18v48h-46v-48h-18v48h-46v-48h-18zm18 66h46v46h-46v-46zm192 0h46v46h-46v-46zm-72.1 15.3c-16.7-.4-30.9 17.8-30.9 39.1 0 11.8 4.1 22.2 10 29.4l7.2 8.5-11 2.1c-7.8 1.5-13.4 5.6-18.3 12.2-4.9 6.7-8.6 16-11.2 26.7-4.7 19.4-5.8 43.2-5.9 64.1h25.8l7.1 94.9c17.9 4.1 37.1 3.9 54.5 0l6.2-94.9H315c0-21.2-.3-45.2-4.6-64.8-2.3-10.8-5.9-20.1-10.8-26.7-5-6.6-10.9-10.6-19.6-12l-11.2-1.7 7-8.9c5.8-7.1 9.6-17.4 9.6-28.9 0-22.8-12.4-38.9-28.5-39.1zM137 261h46v46h-46v-46zm192 0h46v46h-46v-46z" />
    </svg>
  );
}
