/**
 * @param {string} - Required parameter containing id of game
 * @returns {Promise<string>}
 */
export async function getFetchF95z(id: string): Promise<string | null> {
  const host = "https://f95zone.to";
  const url = `${host}/sam/checker.php?threads=${id}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.status === "ok") {
      return json.msg[id];
    } else if (json.status === "error") {
      console.error(`${json.msg}`);
    } else {
      console.error(`${json.status}`);
    }
    return null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
