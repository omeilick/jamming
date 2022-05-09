//import SearchBar from "../Components/SearchBar/SearchBar";

const clientId = '';
const redirectUri = "http://playlist_maker.surge.sh ";
//const redirectUri = "http://localhost:3000"; //local testing
let accessToken;
let userId;


const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        //check for access token
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            accessToken = accessToken.replace("=", "");
            const expiresIn = Number(expiresInMatch[1]);
            //This clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    getCurrentUserId() {
        if (userId) {
            return userId;
        } 

        const accessToken = Spotify.getAccessToken();

        return fetch("https://api.spotify.com/v1/me", { 
            headers: {
             Authorization: `Bearer ${accessToken}`
        }, 
    })
        .then((response) => response.json())
        .then((jsonResponse) => {
            userId = jsonResponse.id;
            return userId;
            })
        .catch(function (err) {
            console.log("Fetch problem on line 54" + err.message);
        });
    },

    async getUserPlaylists() {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const currentUser = await Spotify.getCurrentUserId();
        const url = `https://api.spotify.com/v1/users/${currentUser}/playlists?limit=50`;

        try {
            const response = await fetch(url, { headers: headers });
            if(response.ok) {
                const jsonResponse = await response.json();

                if(!jsonResponse.items) return [];

                const ownedPlaylists = jsonResponse.items.filter(item => item.owner.id === currentUser);
                return ownedPlaylists.map(playlist => ({
                    id: playlist.id,
                    name: playlist.name
                }));
            }

        } catch(error) {
            console.log(error);
        }
    },



    async search(term) {
        const accessToken = Spotify.getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artists: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    },

    async savePlayList(name, trackURIs, id) {
        if (!name || !trackURIs.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        const userId = await Promise.resolve(Spotify.getCurrentUserId());

        if (id) {
            try {
                const url = `https://api.spotify.com/v1/playlists/${id}`;
                const response = await fetch(url, {
                    headers: headers,
                    method: 'PUT',
                    body: JSON.stringify({name: name})
                });
                if(response.ok) {
                    try {
                        const url = `https://api.spotify.com/v1/playlists/${id}/tracks`;
                        const response =  await fetch(url, {
                            headers: headers,
                            method: 'PUT',
                            body: JSON.stringify({ uris: trackURIs })
                        });
                        if (response.ok) {
                            const jsonResponse = await response.json();
                            console.log(jsonResponse);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                    console.log(error)
            }
        } else {
            const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
            try {
                const response = await fetch(url, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                });
                if(response.ok) {
                    const jsonResponse = await response.json();
                    const playlistID = jsonResponse.id;
                    const url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

                    try {
                        const response =  await fetch(url, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({uris: trackURIs})
                        });
                    if(response.ok) {
                        const jsonResponse =  await response.json();
                        console.log(jsonResponse);
                        }                   
                    } catch(error) {
                        console.log(error); 
                    }
                } 
            } catch(error) {
                console.log(error)
             }
        }
    },

    async getPlaylist(id) {
        const accessToken =  Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        const url = `https://api.spotify.com/v1/playlists/${id}`

        try {
            const response =  await fetch(url, {headers: headers});
            if(response.ok) {
                const jsonResponse =  await response.json();
                console.log(jsonResponse);
                return jsonResponse;
            }
        } catch (error) {
            console.log(error)
        }
    }
}
export default Spotify;
