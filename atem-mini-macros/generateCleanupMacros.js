console.log(`<?xml version="1.0" encoding="UTF-8"?>
<Profile majorVersion="1" minorVersion="5" product="ATEM Mini Pro ISO">
    <MacroPool>`);

for (let i = 0; i < 100; i++) {
  console.log(`   <Macro index="${i}" name=" " description=""></Macro>`);
}

console.log(`</MacroPool>
<MacroControl loop="False"/>
</Profile>
`);
