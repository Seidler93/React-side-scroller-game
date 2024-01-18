import './projectile.css';

const Bullet = ({ position, target }) => {

  return <div className='bullet' style={{ left: position.x, bottom: position.y }}></div>
};

export default Bullet