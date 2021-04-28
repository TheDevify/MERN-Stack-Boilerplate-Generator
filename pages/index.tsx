import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/client";
import Head from "next/head";
import { Form } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  const [session, loading] = useSession();
  const [withReact, setWithReact] = useState(false);
  const [isGithubPush, setIsGithubPush] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [reqAlert, setReqAlert] = useState({
    type: "",
    message: "",
  });
  const [repoHtmlUrl, setRepoHtmlUrl] = useState("");

  const downloadZip = () => {
    const GITHUB_REPO_FULL_NAME = withReact
      ? "TheDevify/mern-boilerplate"
      : "TheDevify/mern-without-react-boilerplate";
    (async () => {
      let githubRes = await axios.get(
        `https://api.github.com/repos/${GITHUB_REPO_FULL_NAME}/releases/latest`
      );
      if (githubRes.status && githubRes.status === 200) {
        const newWindow = window.open(
          githubRes.data.assets[0].browser_download_url,
          "_blank",
          "noopener,noreferrer"
        );
        if (newWindow) newWindow.opener = null;
      }
    })();
  };

  const pushToGithub = () => {
    if (session.user.email && repoName && repoName.length > 0) {
      const GITHUB_REPO_FULL_NAME = withReact
        ? "TheDevify/mern-boilerplate"
        : "TheDevify/mern-without-react-boilerplate";
      (async () => {
        const result = await axios
          .post(
            `https://api.github.com/repos/${GITHUB_REPO_FULL_NAME}/generate?access_token=${session.accessToken}`,
            {
              name: repoName,
              owner: session.user.username,
            },
            {
              headers: {
                Accept: "application/vnd.github.baptiste-preview+jso",
                Authorization: `token ${session.accessToken}`,
              },
            }
          )
          .catch((err) => {
            if (err.response.status === 422 && err.response.data?.errors[0]) {
              setReqAlert({
                type: "danger",
                message: `😔 ${err.response.data.errors[0]}`,
              });
            }
          });

        if (result) {
          setRepoHtmlUrl(result.data.html_url);
          setReqAlert({
            type: "success",
            message: "🚀 Repository created successfully!",
          });
        }
      })();
    } else {
      setReqAlert({
        type: "warning",
        message: "ℹ Please enter the repository name.",
      });
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Devify MERN Stack Boilerplate Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card card-bg border-0 shadow">
            <div className="card-body">
              <div className="row justify-content-center px-5">
                <div className="d-flex col-md-12 justify-content-center">
                  <img
                    src="https://media.discordapp.net/attachments/816016473088720896/836225240773820458/mirage-pale.png?width=683&height=683"
                    alt="logo"
                    className="logo"
                  />
                </div>
                <div className="d-flex col-md-12 justify-content-center">
                  <h2 className="text-light title">
                    MERN Stack Boilerplate Generator
                  </h2>
                </div>
                {reqAlert.message !== "" && reqAlert.type !== "" ? (
                  <div className="d-flex col-md-12 mt-4 justify-content-center">
                    <div className={`alert alert-${reqAlert.type} w-100`}>
                      {reqAlert.message}
                      {reqAlert.type === "success" ? (
                        <div>
                          <br />
                          <a href={repoHtmlUrl}>👉 {repoHtmlUrl}</a>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <div className="col-md-12 mt-4 px-3">
                  <p className="text-light font-weight-light subtitle">
                    PROJECT TYPE:
                  </p>

                  <Form.Check
                    checked={withReact}
                    onChange={() => setWithReact(!withReact)}
                    type="checkbox"
                    label=" With React.Js"
                    className="text-white"
                  />

                  {isGithubPush && session.user.email ? (
                    <div className="row justify-content-center">
                      <div className="col-md-12 mt-5">
                        <input
                          type="text"
                          className="form-control"
                          value={repoName}
                          onChange={(e) => setRepoName(e.target.value)}
                          placeholder="GitHub Repo Name"
                        />
                      </div>
                      <div className="col-md-12 mt-3">
                        <button
                          className="btn btn-primary btn-block py-2"
                          onClick={() => pushToGithub()}
                        >
                          Push To GitHub
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-md-6 mt-5">
                        <button
                          className="btn btn-main btn-block py-3"
                          onClick={downloadZip}
                        >
                          Download ZIP File
                        </button>
                      </div>
                      <div className="col-md-6 mt-5">
                        <button
                          className="btn btn-second btn-block py-3"
                          onClick={() => {
                            session?.user.email
                              ? setIsGithubPush(true)
                              : signIn();
                          }}
                        >
                          Push To GitHub
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="row mb-4">
                    <div className="d-flex col-md-12 mt-5 justify-content-center">
                      <a
                        href="https://discord.gg/VkwAAk37Fe"
                        target="_blank"
                        rel="nofollow"
                      >
                        <FontAwesomeIcon
                          icon={faDiscord}
                          className="footer-icon mx-3"
                        />
                      </a>
                      <a
                        href="https://github.com/thedevify"
                        target="_blank"
                        rel="nofollow"
                      >
                        <FontAwesomeIcon
                          icon={faGithub}
                          className="footer-icon mx-3"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
