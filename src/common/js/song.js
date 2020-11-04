export default class Song {
  constructor ({ id, mid, singers, name, album, duration, image, playUrl, comments, subTitle, title, mediaMid }) {
    this.id = id
    this.mid = mid
    this.singers = singers
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.playUrl = playUrl
    this.comments = comments
    this.subTitle = subTitle
    this.title = title
    this.mediaMid = mediaMid
  }
}

export function createSong (song) {
  return new Song({
    id: song.id,
    mid: song.mid,
    singers: song.singers,
    name: song.name,
    album: song.album,
    duration: song.duration,
    image: song.image,
    comments: song.comments,
    subTitle: song.subTitle,
    title: song.title,
    playUrl: song.playUrl,
    mediaMid: song.mediaMid
  })
}
