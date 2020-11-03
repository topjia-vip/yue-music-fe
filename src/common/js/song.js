import { getLyric } from '../../api/song'
import { ERR_OK } from '../../api/config'
import { Base64 } from 'js-base64'

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

  getLyric () {
    if (this.lyric) {
      let lyric = this.lyric
      let trans = this.trans
      let data = {
        lyric,
        trans
      }
      return Promise.resolve(data)
    }

    return new Promise((resolve) => {
      getLyric(this.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.data.lyric)
          let lyric = this.lyric
          let trans
          if (res.data.tran) {
            this.trans = Base64.decode(res.data.tran)
            trans = this.trans
          }
          let data = {
            lyric,
            trans
          }
          resolve(data)
        }
      })
    })
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
