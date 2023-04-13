export function sendNotFound(res) {
    res.status(404).send({ message: "ressource not found" });
}