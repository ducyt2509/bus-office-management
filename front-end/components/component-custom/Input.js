import { useState, useCallback } from 'react';

export default function InputBO(props) {
  const [value, setValue] = useState(props.value ? props.value : '');
  const [type, setType] = useState(props.type ? 'password' : 'text');
  const handleChangeValue = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    [value]
  );
  const handleChangeTypeInput = useCallback(() => {
    type == 'text' ? setType('password') : setType('text');
  }, [type]);
  return (
    <div className="BO_layout_input">
      <p className="BO_title_input">{props.title}</p>
      {props.left || props.prefix || props.suffix || props.right || props.type ? (
        <div className="BO_label_left_right_input">
          {props.left && <div className="BO_left_input">{props.left}</div>}
          {props.prefix && <div className="BO_prefix_input">{props.prefix}</div>}
          <input
            type={type}
            className="BO_input"
            ariaInvalid={props.ariaInvalid ? 'true' : 'false'}
            value={value}
            onChange={handleChangeValue}
          />
          {props.type && (
            <div className="BO_password_input" onClick={handleChangeTypeInput}>
              <button>Show</button>
            </div>
          )}
          {props.suffix && <div className="BO_suffix_input">{props.suffix}</div>}
          {props.right && <div className="BO_right_input">{props.right}</div>}
        </div>
      ) : (
        <input
          type="text"
          className="BO_input"
          ariaInvalid={props.ariaInvalid ? 'true' : 'false'}
          value={value}
          onChange={handleChangeValue}
        />
      )}
    </div>
  );
}
