FROM archlinux/base
LABEL maintainer="weslenng"

RUN echo 'Server = http://linorg.usp.br/archlinux/$repo/os/$arch' > /etc/pacman.d/mirrorlist
RUN pacman -Syu --noconfirm chromium nodejs unzip yarn wget

WORKDIR /app

RUN wget https://komodochess.com/pub/komodo-10.zip
RUN unzip komodo-10.zip
RUN chmod +x komodo-10_ae4bdf/Linux/komodo-10-linux

RUN pacman -R --noconfirm unzip wget

COPY package.json ./
COPY yarn.lock ./
RUN yarn --pure-lockfile

COPY ./. .
RUN yarn build

EXPOSE 4096
CMD ["yarn", "start"]
