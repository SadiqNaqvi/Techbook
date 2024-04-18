import { bgImgSmall } from '../QC-Background'

export default function SettingBackgroundSection(props) {

  const handleInputImage = (event) => {

    // Fetch the image selected by the user.
    const selectedImage = event.target.files[0];

    // Image the image is supported the proceed and is less than 3MB.
    if (selectedImage && selectedImage.size / (1024 * 1024) < 3) {

      //Read the seleted image and store it for future use. 
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);

      reader.onload = (e) => {
        props.changeAppSetting('CustomNoteBg', e.target.result);
        props.changeAppSetting('NoteBg', 'input');
      };
    }
  }

  return (
    <div id="qc_tb_settingBackgroundSection">
      <div id="qc_tb_backgroundImgBox">

        {bgImgSmall.map((img, ind) => (
          <div className={`qc_tb_settingBgImgBoxes ${typeof noteBg === "number" && parseInt(props.noteBg) === ind ? 'selected' : ''}`} style={{ backgroundImage: `url(${img})` }} key={ind} onClick={() => props.changeAppSetting('NoteBg', ind)}>
            <span className="qc_tb_settingBgImgSelectedBox">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M448.1 118.2L437 129.7 173.6 404l-11.5 12-11.5-12L11.1 258.8 0 247.2l23.1-22.2 11.1 11.5L162.1 369.8 414 107.5 425 96l23.1 22.2z"></path></svg>
              Selected
            </span>
          </div>
        ))}

        <div id='noneBox' className={`qc_tb_settingBgImgBoxes ${props.noteBg === 'none' ? 'selected' : ''}`} onClick={() => props.changeAppSetting('NoteBg', 'none')}>
          <span id="qc_tb_settingBgImgNoneBox">
            {props.noteBg === 'none' ?
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M448.1 118.2L437 129.7 173.6 404l-11.5 12-11.5-12L11.1 258.8 0 247.2l23.1-22.2 11.1 11.5L162.1 369.8 414 107.5 425 96l23.1 22.2z"></path></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M402.7 425.3l-316-316C52.6 148.6 32 199.9 32 256c0 123.7 100.3 224 224 224c56.1 0 107.4-20.6 146.7-54.7zm22.6-22.6C459.4 363.4 480 312.1 480 256C480 132.3 379.7 32 256 32c-56.1 0-107.4 20.6-146.7 54.7l316 316zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path></svg>
            }
            None
          </span>
        </div>

        <div id='customBox' className={`qc_tb_settingBgImgBoxes ${props.noteBg === 'input' ? 'selected' : ''}`} style={{ backgroundImage: `url(${props.customNoteBg})` }}>

          <input type="file" title='' onChange={handleInputImage} />

          <div id="qc_tb_settingBgImgCustomBox">
            {props.noteBg !== 'input' && props.customNoteBg === '' ?
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M235.3 4.7c-6.2-6.2-16.4-6.2-22.6 0l-128 128c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L208 54.6V336c0 8.8 7.2 16 16 16s16-7.2 16-16V54.6L340.7 155.3c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-128-128zM32 336c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 44.2 35.8 80 80 80H368c44.2 0 80-35.8 80-80V336c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V336z"></path></svg>
                Upload
              </>
              :
              props.noteBg === 'input' && props.customNoteBg !== '' &&
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M448.1 118.2L437 129.7 173.6 404l-11.5 12-11.5-12L11.1 258.8 0 247.2l23.1-22.2 11.1 11.5L162.1 369.8 414 107.5 425 96l23.1 22.2z"></path></svg>
                Selected
              </>
            }
          </div>
        </div>

      </div>
    </div >
  )
}
