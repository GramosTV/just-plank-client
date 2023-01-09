import {
  faDiscord,
  faInstagram,
  faReddit,
  faRedditAlien,
  faTiktok,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../interfaces/user";
import { Loading } from "./elements/Loading";
import { LogoutOnAllDevicesBtn, LogoutSettingsBtn } from "./elements/LogoutBtn";
import { FormWarning } from "./forms/FormWarning";

interface ProfileStats extends User {
  totalDays: number;
  totalPlanks: number;
  bestPlankTime: number;
  totalCaloriesBurnt: number;
  totalPlankTime: number;
}
interface FormElements extends HTMLFormControlsCollection {
  height: HTMLInputElement;
}
interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}
export function Settings({ refreshUser, setRefreshUser }: any) {
  const [user, setUser] = useState<ProfileStats>({
    id: "",
    email: "",
    password: "",
    name: "",
    unit: 0,
    dateOfBirth: "",
    gender: 0,
    height: 0,
    weight: 0,
    statsSet: 0,
    emailVerified: 0,
    isGoogleAccount: 0,
    profile: 0,
    totalDays: 0,
    totalPlanks: 0,
    bestPlankTime: 0,
    totalCaloriesBurnt: 0,
    totalPlankTime: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [logoutFlag, setLogoutFlag] = useState<number | boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    let isSubscribed = true;
    async function fetchUser() {
      try {
        if (isSubscribed) {
          setLoading(true);
        }
        const response = await fetch(`/api/user`);
        const json = await response.json();
        if (isSubscribed) {
          setUser(json.user);
        }
        if (json.status && json.user.emailVerified === 0) {
          navigate("/login");
        } else if (json.status && json.user.statsSet === 0) {
          navigate("/stats");
        } else if (json.status) {
          if (isSubscribed) {
            setLoading(false);
          }
          return;
        } else {
          navigate("/login");
        }
      } catch (e) {
        console.error(e);
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }
    fetchUser();
    return () => {
      isSubscribed = false;
    };
  }, [navigate, logoutFlag]);

  const [formWarning, setFormWarning] = useState("");
  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) > 250 && !user.unit) {
      setFormWarning(`You're too tall`);
    } else if (Number(e.target.value) > 98 && user.unit) {
      setFormWarning(`You're too tall`);
    } else {
      setFormWarning("");
    }
  };

  const handleSubmitHeightChange = async (
    e: React.FormEvent<YourFormElement>
  ) => {
    e.preventDefault();
    const height = e.currentTarget.elements.height.value;
    const res = await (
      await fetch("/api/settings/updateHeight", {
        method: "PUT",
        body: JSON.stringify({ height: height }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    setUser({ ...user, height: res.height });
  };
  const handleUnitChange = async () => {
    const res = await (
      await fetch("/api/settings/updateUnit", {
        method: "PUT",
        body: JSON.stringify({ unit: user.unit ? 0 : 1 }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    setUser({ ...user, unit: res.unit });
    setRefreshUser(!refreshUser);
  };
  if (loading) return <Loading />;
  return (
    <div className="settings">
      <form className="form" onSubmit={handleSubmitHeightChange}>
        <h2>Update your height</h2>
        <h3>
          Your current height is{" "}
          {user.unit
            ? Math.trunc((user.height / 2.54) * 100) / 100 + "in"
            : Math.trunc(user.height * 100) / 100 + "cm"}
        </h3>
        <div>
          <div>
            <input
              className="input"
              onChange={handleHeightChange}
              placeholder={`Height (${user.unit ? "in" : "cm"})`}
              type="number"
              name="height"
              id="height"
              min={1}
              max={user.unit ? 98 : 250}
              required
            />
            <button type="submit" className="btn">
              Confirm
            </button>
          </div>
        </div>
        <FormWarning formWarning={formWarning}></FormWarning>
      </form>
      <div>
        <h2>Change your unit</h2>
        <button className="btn" onClick={handleUnitChange}>
          Change to {user.unit ? "Metric" : "Imperial"}
        </button>
      </div>
      <div className="logoutBtns">
        <LogoutSettingsBtn
          logoutFlag={logoutFlag}
          setLogoutFlag={setLogoutFlag}
        />
        <LogoutOnAllDevicesBtn
          logoutFlag={logoutFlag}
          setLogoutFlag={setLogoutFlag}
        />
      </div>
      <form action="https://www.paypal.com/donate" method="post" target="_top">
        <input type="hidden" name="hosted_button_id" value="TFHM8LJBQUC2C" />
        <input
          type="image"
          src="https://www.paypalobjects.com/en_US/PL/i/btn/btn_donateCC_LG.gif"
          data-border="0"
          name="submit"
          title="PayPal - The safer, easier way to pay online!"
          alt="Donate with PayPal button"
        />
        <img
          alt=""
          data-border="0"
          src="https://www.paypal.com/en_PL/i/scr/pixel.gif"
          width="1"
          height="1"
        />
      </form>

      <div className="socialMedia">
        <a
          href="https://discord.com/invite/XMQnsDWJRs"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faDiscord} />
        </a>
        <a
          href="https://www.instagram.com/justplankapp/"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="https://twitter.com/justplankapp"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          href="https://www.youtube.com/channel/UCV9JvxrPd8fcNwDMkv_rv1A"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faYoutube} />
        </a>
        <a
          href="https://www.tiktok.com/@justplankapp"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faTiktok} />
        </a>
        <a
          href="https://www.reddit.com/r/justplank"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faRedditAlien} />
        </a>
      </div>
      <div>
        <strong>
          Current version: {process.env.REACT_APP_CURRENT_VERSION}
        </strong>
      </div>
    </div>
  );
}
