import '../CSS/Popups.css'

export default function WarningModal(props) {

  const handleFunc = (btn) => {
    if (btn === 'red') {
      props.warning.func();
    }
    props.updateWarning({ ...props.warning, show: false });
  }

  return (
    <div id='qc_tb_warningModal'>
      <div id="qc_tb_warningCont">
        <div id="qc_tb_wpTop">
          <p>{props.warning.msg}</p>
        </div>
        <div id="qc_tb_wpBottom">
          <button id="qc_tb_wpGreenBtn" onClick={() => handleFunc('green')}>{props.warning.greenMsg}</button>
          <button id="qc_tb_wpRedBtn" onClick={() => handleFunc('red')}>{props.warning.redMsg}</button>
        </div>
      </div>
    </div>
  )
}
