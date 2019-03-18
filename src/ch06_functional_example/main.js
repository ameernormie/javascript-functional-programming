const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN("ramda/0.21.0/ramda.min");
const jquery = CDN("jquery/3.0.0-rc1/jquery.min");

/**
 ****** Our app will do 4 things *****
 * Construct a url for our particular search term
 * Make the flickr api call
 * Transform the resulting json into html images
 * Place them on the screen
 */

requirejs.config({ paths: { ramda, jquery } });
requirejs(["jquery", "ramda"], ($, { compose, curry, map, prop }) => {
  // app goes here
  // -- Utils ----------------------------------------------------------
  const Impure = {
    trace: curry((tag, x) => {
      console.log(tag, x);
      return x;
    }), // eslint-disable-line no-console
    getJSON: curry((callback, url) => $.getJSON(url, callback)),
    setHtml: curry((sel, html) => $(sel).html(html))
  };

  // -- Pure -----------------------------------------------------------
  const host = "api.flickr.com";
  const path = "/services/feeds/photos_public.gne";
  const query = t => `?tags=${t}&format=json&jsoncallback=?`;
  const url = t => `https://${host}${path}${query(t)}`;

  const img = src => $("<img />", { src });
  const mediaUrl = compose(
    prop("m"),
    prop("media")
  );
  const mediaToImg = compose(
    img,
    mediaUrl
  );
  const images = compose(
    map(mediaToImg),
    prop("items")
  );

  // -- Impure ---------------------------------------------------------
  const render = compose(
    Impure.setHtml("#js-main"),
    images
  );
  const app = compose(
    Impure.getJSON(render),
    url
  );

  app("birds");
});
