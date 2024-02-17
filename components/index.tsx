import React, {
  useRef,
  forwardRef,
  ChangeEvent,
  ForwardedRef,
  useState,
} from "react";
import Styles from "../styles/Comp.module.scss";
const Input = forwardRef(
  (
    props: {
      onCancel?: () => any;
      onChange?: (e: ChangeEvent) => any;
      placeholder?: string;
      value?: string;
      id?: string;
      type?: string;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const {
      onChange,
      onCancel,
      placeholder,
      value,
      id = "",
      type = "text",
    } = props;
    const searchBoxRef = useRef<HTMLInputElement>();
    const [isValue, setValue] = useState<string>("");
    return (
      <div style={{ position: "relative", width: "100%" }}>
        <input
          className={`searchBox`}
          placeholder={placeholder || "Search chat..."}
          onChange={(e) => {
            setValue(e.target.value);
            onChange && onChange(e);
          }}
          ref={(ele) => {
            searchBoxRef.current = ele as HTMLInputElement;

            if (typeof ref === "function") {
              ref(ele as HTMLInputElement);
            } else if (ref) {
              ref.current = ele as HTMLInputElement;
            }
          }}
          // value={refElement || value}
          id={id}
          type={type}
        />
        {isValue && (
          <span
            className="clearIcon"
            onClick={() => {
              ref && typeof ref !== "function"
                ? (ref.current.value = "")
                : (searchBoxRef.current.value = "");
              onCancel && onCancel();
              setValue("");
            }}
          />
        )}
      </div>
    );
  }
);

function Avatar(props) {
  const { avatar = { contentType: "", image: "" } } = props;
  return (
    <img
      // src={`data:image/${avatar.contentType};base64,${avatar.image}`}
      src={avatar.image}
      alt="Avatar"
      className="avatar"
    />
  );
}

function Chips(props) {
  const { data, onChipClick } = props;
  return data?.map((chip) => (
    <React.Fragment key={chip._id}>
      <div
        className="chips-container"
        onClick={(e) => {
          e.preventDefault();
          const ind = data.findIndex((val) => val._id == chip._id);
          data.splice(ind, 1);
          onChipClick([...data]);
        }}
      >
        <Avatar avatar={chip.profile_pic} />
        <span className="chips" />
      </div>
    </React.Fragment>
  ));
}

function MenuItems(props) {
  const { list, anchorEle, onMenuItemClick, onFocusOut } = props;
  const style = {
    top: anchorEle ? anchorEle.getBoundingClientRect().bottom : 0,
    left: anchorEle ? anchorEle.getBoundingClientRect().left : 0,
  };
  // if (anchorEle) {
  document.addEventListener("click", (event: any) => {
    const editMenuDiv = event.target.closest("#EditMenus");
    if (!editMenuDiv) {
      onFocusOut();
    }
  });
  // }
  return (
    <div
      id="EditMenus"
      className={anchorEle ? "MenuBox" : "d-none"}
      style={style}
    >
      <ul>
        {list?.map((item) => (
          <li key={item.id} onClick={() => onMenuItemClick(item)}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Button(props) {
  const { text, handleClick, className = "" } = props;
  return (
    <button onClick={handleClick} className={`${Styles.button} ${className}`}>
      {text}
    </button>
  );
}

interface FileUploadInterface {
  type: string;
  handleUpload: (e: ChangeEvent) => any;
  ref: React.LegacyRef<HTMLInputElement>;
}

const FileUploader = React.forwardRef(function (
  props: FileUploadInterface,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { type, handleUpload } = props;
  return (
    <input
      type="file"
      accept={
        type ||
        "audio/*, video/*, image/*, .doc, .docx, .pdf, .ppt, .pptx, .xls, .xlsx"
      }
      onChange={handleUpload}
      className="file_upload"
      ref={(ele) => {
        if (typeof ref === "function") ref(ele);
        else if (ref) ref.current = ele;
      }}
    />
  );
});

export { Input, Avatar, Chips, MenuItems, Button, FileUploader };
