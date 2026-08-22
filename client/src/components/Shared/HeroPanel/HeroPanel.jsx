import logoImg from '@/components/Shared/Assests/logo.png';
import './HeroPanel.scss';

function HeroPanel() {
    return (
        <div className="hero-panel">
            <img src={logoImg} alt="GlobeTrotter Logo" className="hero-image" />
        </div>
    );
}

export default HeroPanel;
