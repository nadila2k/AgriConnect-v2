import classes from './Slider.module.css'


const Slider = () => {
  return (
    <div
    className={classes.slider}
    style={{
      backgroundImage:
        "url(https://t4.ftcdn.net/jpg/01/43/88/31/360_F_143883132_bn9n14k3aX10bq5HN18IYHPbx9YyiSEA.jpg)",
    }}
  >
    <div className={classes.overlay}></div>
    <div className={classes['slider-content']}>
      <h1>Welcome to AGRI Connect</h1>
      <p>Manage harvesting and minimize vegetable wastage efficiently.</p>
      <div className={classes['slider-buttons']}>
        <button className={classes['explore-btn']}>Explore</button>
        <button className={classes['contact-btn']}>Contact</button>
      </div>
    </div>
  </div>
  )
}

export default Slider