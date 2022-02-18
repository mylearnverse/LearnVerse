import React, {useContext, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import classNames from "classnames";
import configs from "../../utils/configs";
import {getAppLogo} from "../../utils/get-app-logo";
import {CreateRoomButton} from "./CreateRoomButton";
import {PWAButton} from "./PWAButton";
import {useFavoriteRooms} from "./useFavoriteRooms";
import {usePublicRooms} from "./usePublicRooms";
import styles from "./HomePage.scss";
import {AuthContext} from "../auth/AuthContext";
import {createAndRedirectToNewHub} from "../../utils/phoenix-utils";
import {MediaGrid} from "../room/MediaGrid";
import {MediaTile} from "../room/MediaTiles";
import {PageContainer} from "../layout/PageContainer";
import {scaledThumbnailUrlFor} from "../../utils/media-url-utils";
import {Column} from "../layout/Column";
import {Button} from "../input/Button";
import {Container} from "../layout/Container";
import {SocialBar} from "../home/SocialBar";
import {SignInButton} from "./SignInButton";
import maskEmail from "../../utils/mask-email";
import {ReactComponent as HmcLogo} from "../icons/HmcLogo.svg";
import { Buffer } from "buffer"; global.Buffer = Buffer;

export function HomePage() {
    const auth = useContext(AuthContext);
    const intl = useIntl();

    const {results: favoriteRooms} = useFavoriteRooms();
    const {results: publicRooms} = usePublicRooms();

    const sortedFavoriteRooms = Array.from(favoriteRooms).sort((a, b) => b.member_count - a.member_count);
    const sortedPublicRooms = Array.from(publicRooms).sort((a, b) => b.member_count - a.member_count);
    const wrapInBold = chunk => <b>{chunk}</b>;
    const isHmc = configs.feature("show_cloud");
    useEffect(() => {
        const qs = new URLSearchParams(location.search);

        // Support legacy sign in urls.
        if (qs.has("sign_in")) {
            const redirectUrl = new URL("/signin", window.location);
            redirectUrl.search = location.search;
            window.location = redirectUrl;
        } else if (qs.has("auth_topic")) {
            const redirectUrl = new URL("/verify", window.location);
            redirectUrl.search = location.search;
            window.location = redirectUrl;
        }

        if (qs.has("new")) {
            createAndRedirectToNewHub(null, null, true);
        }
    }, []);

    const canCreateRooms = !configs.feature("disable_room_creation") || auth.isAdmin;
    const email = auth.email;
    return (
        <PageContainer className={styles.homePage}>
            <Container>
                <Column center grow>
                    <div>
                        <h1>Educators</h1>
                    </div>
                </Column>
            </Container>
            <Container>
                <Column center grow>
                    <div className="panel">
                        <h2 className={styles.roomsHeading}>Join a room:</h2>
                        <p>Join an existing room using a unique room code.</p>
                        <Button preset="landing" as="a" href="/link">
                            <FormattedMessage id="home-page.have-code" defaultMessage="Enter Room Code"/>
                        </Button>
                    </div>
                </Column>
                <Column center grow>
                    <div className="panel">
                        <h2 className={styles.roomsHeading}>Create a room:</h2>
                        <p>Create a room to share with your students.</p>
                        {canCreateRooms && <CreateRoomButton/>}
                    </div>
                </Column>
            </Container>
            <div className="divider"></div>
            <Container>
                <div className={styles.hero}>
                    {auth.isSignedIn ? (
                        <div className={styles.signInContainer}>
              <span>
                <FormattedMessage
                    id="header.signed-in-as"
                    defaultMessage="Signed in as {email}"
                    values={{email: maskEmail(email)}}
                />
              </span>
                            <a href="#" onClick={auth.signOut} className={styles.mobileSignOut}>
                                <FormattedMessage id="header.sign-out" defaultMessage="Sign Out"/>
                            </a>
                        </div>
                    ) : (
                        <SignInButton mobile/>
                    )}
                    <div className="hidden">
                        <div className={styles.logoContainer}>
                            {isHmc ? (
                                <HmcLogo className="hmc-logo"/>
                            ) : (
                                <img alt={configs.translation("app-name")} src={getAppLogo()}/>
                            )}
                        </div>

                        <div className={styles.appInfo}>
                            <div className={styles.appDescription}>{configs.translation("app-description")}</div>
                            {canCreateRooms && <CreateRoomButton/>}
                            <PWAButton/>
                        </div>
                        <div className={styles.heroImageContainer}>
                            <img
                                alt={intl.formatMessage(
                                    {
                                        id: "home-page.hero-image-alt",
                                        defaultMessage: "Screenshot of {appName}"
                                    },
                                    {appName: configs.translation("app-name")}
                                )}
                                src={configs.image("home_background")}
                            />
                        </div>
                    </div>
                </div>
            </Container>
            <Container className={classNames(styles.features, styles.colLg, styles.centerLg)}>
                <Column padding gap="xl" className={styles.card}>
                    <img src={configs.image("landing_rooms_thumb")}/>
                    <h3>
                        <FormattedMessage id="home-page.rooms-title" defaultMessage="Create immersive experiences"/>
                    </h3>
                    <p>
                        <FormattedMessage
                            id="home-page.rooms-blurb"
                            defaultMessage="Create and share virtual classrooms instantly, each room as a unique pin code: <b>- no downloads or VR headset necessary.</b>"
                            values={{b: wrapInBold}}
                        />
                    </p>
                </Column>
                <Column padding gap="xl" className={styles.card}>
                    <img src={configs.image("landing_communicate_thumb")}/>
                    <h3>
                        <FormattedMessage id="home-page.communicate-title"
                                          defaultMessage="Accelerate student outcomes"/>
                    </h3>
                    <p>
                        <FormattedMessage
                            id="home-page.communicate-blurb"
                            defaultMessage="Easy to use immersive learning environments to take your teach to the next level and accelerate student outcomes."
                        />
                    </p>
                </Column>
                <Column padding gap="xl" className={styles.card}>
                    <img src={configs.image("landing_media_thumb")}/>
                    <h3>
                        <FormattedMessage id="home-page.media-title" defaultMessage="Works with your existing content"/>
                    </h3>
                    <p>
                        <FormattedMessage
                            id="home-page.media-blurb"
                            defaultMessage="Share your existing lesson plans: videos, PDF files, links b0y dragging dropping into your 3d space, add 3D models to enhance the learning experience "
                        />
                    </p>
                </Column>
            </Container>
            {sortedFavoriteRooms.length > 0 && (
                <Container className={styles.roomsContainer}>
                    <h4 className={styles.roomsHeading}>
                        <FormattedMessage id="home-page.favorite-rooms" defaultMessage="My Saved Rooms"/>
                    </h4>
                    <Column grow padding className={styles.rooms}>
                        <MediaGrid center>
                            {sortedFavoriteRooms.map(room => {
                                return (
                                    <MediaTile
                                        key={room.id}
                                        entry={room}
                                        processThumbnailUrl={(entry, width, height) =>
                                            scaledThumbnailUrlFor(entry.images.preview.url, width, height)
                                        }
                                    />
                                );
                            })}
                        </MediaGrid>
                    </Column>
                </Container>
            )}
            <div className="divider"></div>
            {sortedPublicRooms.length > 0 && (
                <Container className={styles.roomsContainer}>
                    <Column grow padding>
                        <h2 className="demo">Try a demo room</h2>
                        <div className="panel">
                            <MediaGrid center>
                                {sortedPublicRooms.map(room => {
                                    return (
                                        <MediaTile
                                            key={room.id}
                                            entry={room}
                                            processThumbnailUrl={(entry, width, height) =>
                                                scaledThumbnailUrlFor(entry.images.preview.url, width, height)
                                            }
                                        />
                                    );
                                })}
                            </MediaGrid>
                        </div>
                    </Column>
                </Container>
            )}
            {isHmc ? (
                <Column center>
                    <SocialBar/>
                </Column>
            ) : null}
        </PageContainer>
    );
}
