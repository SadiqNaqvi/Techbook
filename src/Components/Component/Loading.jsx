import '../CSS/Loading.css'

export default function Loading({ use }) {
  return (
    <section id="qc_tb_loadingPage" className={use}>
      <div id='qc_tb_loadingCont'>
        <span className='qc_tb_loadingBall qc_tb_redBall'></span>
        <span className='qc_tb_loadingBall qc_tb_yellowBall'></span>
        <span className='qc_tb_loadingBall qc_tb_greenBall'></span>
      </div>
    </section >
  )
}
