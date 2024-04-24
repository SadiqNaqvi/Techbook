export default function SettingColorSection(props) {

  // Collection of all the available colors which can be apply on the web app.
  const colorsArray = ['96d7f1', "00BFFF", '96f1b5', "66cdaa", '5dc153', "9AB973", "3cb371", 'f5bc9b', 'c56d91', "FB607F", "FF1DCE", "FF9966", "F88379", "FF91A4", "FFD700", "E8AC41", "FFA000", "DDD06A", 'd79ef9', "7B68EE"]

  return (
    <div id="qc_tb_settingPersonalizeSection">

      <div id="qc_tb_settingColorPalleteBox">

        {colorsArray.map((color, index) => (
          <button className={`qc_tb_settingColorPalleteBox ${props.appColor === color ? 'selected' : ''}`} style={{ backgroundColor: `#${color}` }} key={index} onClick={() => props.changeAppSetting('AppColor', color)}>
          </button>
        ))}

      </div>

      <p className="qc_tb_settingDesc">Elevate your experience on our webapp with Palette Play - a dynamic customization feature that puts the power of color in your hands. Unleash your creativity by effortlessly switching between a range of captivating color palettes that resonate with your mood.</p>
    </div>
  )
}
