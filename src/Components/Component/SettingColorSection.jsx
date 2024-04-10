export default function SettingColorSection(props) {
  
  const colorsArray = [
    {
      secondary: '9E9E9E',
      accent: 'c3c3c3'
    },
    {
      secondary: '6cb9cf',
      accent: '96d7f1'
    },
    {
      secondary: '399f9e',
      accent: '71d5d4'
    },
    {
      secondary: '6ccf85',
      accent: '96f1b5'
    },
    {
      secondary: '38972f',
      accent: '5dc153'
    },
    {
      secondary: 'e58683',
      accent: 'fba5a3'
    },
    {
      secondary: 'ffb6c1',
      accent: 'ffd0d7'
    },
    {
      secondary: 'd578c9',
      accent: 'ffc7f8'
    },
    {
      secondary: 'aa6ccf',
      accent: 'd79ef9'
    },
    {
      secondary: 'd6b598',
      accent: 'f7d4b4'
    },
    {
      secondary: 'cf916c',
      accent: 'f5bc9b'
    },
    {
      secondary: 'c96352',
      accent: 'ffa393'
    },
    {
      secondary: '742b49',
      accent: 'c56d91'
    },
    {
      secondary: '7a4930',
      accent: 'b97b5b'
    },
    {
      secondary: '9d8a67',
      accent: 'dbc498'
    },
    {
      secondary: 'ddb469',
      accent: 'f7d9a2'
    },
    {
      secondary: 'E09540',
      accent: 'ffc380'
    },
    {
      secondary: 'faaf96',
      accent: 'FBCEB1'
    },
    {
      secondary: 'ff7f50',
      accent: 'ffa685'
    }

  ]

  return (
    <div id="qc_tb_settingPersonalizeSection">

      <div id="qc_tb_settingColorPalleteBox">
        {colorsArray.map((color, index) => (
          <div className={`qc_tb_settingColorPalleteBox ${props.appColor?.secondary === color.secondary && 'selected'}`} style={{ backgroundColor: `#${color.secondary}` }} key={index} onClick={() => props.changeAppSetting('AppColor', color)}></div>
        ))}
      </div>
      <p className="qc_tb_settingDesc">Elevate your experience on our webapp with Palette Play - a dynamic customization feature that puts the power of color in your hands. Unleash your creativity by effortlessly switching between a range of captivating color palettes that resonate with your mood.</p>
    </div>
  )
}
