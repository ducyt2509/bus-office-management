import { Icon } from '@chakra-ui/react';
import { IoLocationOutline } from 'react-icons/io5';

export default function PopularRoute(props) {
  return (
    <div className="popular-route">
      <div className="popular-route__title">
        <span>Tuyến Phổ Biến</span>
      </div>
      <div className="popular-route__list">
        <div className="popular-route__item">
          <div className="popular-route__item-content">
            <span className="popular-route__item-title">Lorem ipsum dolor </span>
            <p className="popular-route__item-desc">
              {' '}
              <Icon as={IoLocationOutline} boxSize={5} /> Lorem ipsum dolor sit amet onsectetur.
            </p>
          </div>
        </div>

        <div className="popular-route__item">
          <div className="popular-route__item-content">
            <span className="popular-route__item-title">Lorem ipsum dolor </span>
            <p className="popular-route__item-desc">
              {' '}
              <Icon as={IoLocationOutline} boxSize={5} /> Lorem ipsum dolor sit amet onsectetur.
            </p>
          </div>
        </div>
        <div className="popular-route__item">
          <div className="popular-route__item-content">
            <span className="popular-route__item-title">Lorem ipsum dolor </span>
            <p className="popular-route__item-desc">
              {' '}
              <Icon as={IoLocationOutline} boxSize={5} /> Lorem ipsum dolor sit amet onsectetur.
            </p>
          </div>
        </div>
        <div className="popular-route__item">
          <div className="popular-route__item-content">
            <span className="popular-route__item-title">Lorem ipsum dolor </span>
            <p className="popular-route__item-desc">
              {' '}
              <Icon as={IoLocationOutline} boxSize={5} /> Lorem ipsum dolor sit amet onsectetur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
