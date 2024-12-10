use std::{collections::HashMap, str::Chars};

use itertools::{Chunk, Itertools};
use lib::inputs::d9::PRIMARY;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
struct File {
    id: usize,
    length: usize,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
enum DiskInfo {
    FileInfo(File),
    FreeInfo(usize),
}
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
struct LocatedFile {
    file: File,
    memory_location: usize,
}

impl LocatedFile {
    fn checksum(&self) -> usize {
        return self.file.checksum(self.memory_location);
    }
}

impl DiskInfo {
    pub fn from((id, mut chunk): (usize, Chunk<'_, Chars<'_>>)) -> [Option<Self>; 2] {
        let file = chunk.next()
            .map(|file_len_char| DiskInfo::FileInfo(File { id, length: file_len_char as usize - '0' as usize }));
        let free = chunk.next()
            .map(|free_len_char|DiskInfo::FreeInfo(free_len_char as usize - '0' as usize));
        return [
            file,
            free,
        ];
    }

    pub fn try_to_file(&self) -> Option<File> {
        if let Self::FileInfo(file) = self {
            return Some(file.clone());
        }
        else {
            return None;
        }
    }
    pub fn try_to_free(&self) -> Option<usize> {
        if let Self::FreeInfo(len) = self {
            return Some(len.clone());
        }
        else {
            return None;
        }
    }
    pub fn to_file(&self) -> File {
        return self.try_to_file().unwrap();
    }
    pub fn to_free(&self) -> usize {
        return self.try_to_free().unwrap();
    }
}

impl File {
    pub fn checksum(&self, index: usize) -> usize {
        let range_sum: usize = (index..index+self.length)
            .sum();
        return range_sum * self.id;
    }
}

fn main() {

    let disk_map = PRIMARY.chars()
        .chunks(2)
        .into_iter()
        .enumerate()
        .flat_map(DiskInfo::from)
        .flatten()
        .collect_vec();
    
    let mut compressed: Vec<File> = Vec::new();

    let mut head: usize = 0;
    let mut tail: usize = disk_map.len() - 1;
    let mut free_space: usize = 0;
    let mut file_id: usize = 0;
    let mut remaining_file: usize = 0;

    while head <= tail {
        
        if free_space == 0 {
            let next_file = disk_map[head].to_file();
            free_space = disk_map[head + 1].to_free();
            compressed.push(next_file);
            head += 2;
        }
        else if remaining_file > 0 && remaining_file <= free_space {
            compressed.push(File {
                id: file_id,
                length: remaining_file,
            });
            free_space = free_space - remaining_file;
            remaining_file = 0;
        }
        else if remaining_file > 0 {
            compressed.push(File {
                id: file_id,
                length: free_space
            });
            remaining_file = remaining_file - free_space;
            free_space = 0;
        }
        else {
            let disk_info = disk_map[tail];
            tail -= 1;
            match disk_info {
                DiskInfo::FileInfo(file) => {
                    remaining_file = file.length;
                    file_id = file.id;
                },
                DiskInfo::FreeInfo(_) => {},
            }
        }
    }
    if remaining_file > 0 {
        compressed.push(File { id: file_id, length: remaining_file });
    }

    let [_, p1] = compressed.iter()
        .fold([0, 0], |[index, sum]: [usize; 2], file| {
        let new_sum = file.checksum(index);
        return [index + file.length, sum + new_sum];
    });

    println!("{}", p1);

    let (_, mut with_locs): (usize, HashMap<usize, LocatedFile>) = disk_map.iter()
        .fold((0, HashMap::new()), |(index, mut map), disk_info| {
            match disk_info {
                DiskInfo::FileInfo(file) => {
                    map.insert(file.id, LocatedFile { file: file.clone(), memory_location: index });
                    return (index + file.length, map);
                },
                DiskInfo::FreeInfo(len) => (index + len, map),
            }
        });
    
    let max = with_locs.keys().max().unwrap().clone();

    for id in (0..=max).rev() {
        println!("id: {}", id);

        let free_option: Option<[usize; 2]> =with_locs.values()
        .sorted_by(|a,b| Ord::cmp(&a.memory_location, &b.memory_location))
        .filter(|f| f.memory_location <= with_locs[&id].memory_location)
        .tuple_windows()
        .map(|(a,b)| [a.memory_location + a.file.length, b.memory_location - a.memory_location - a.file.length])
            .filter(|[_, len]| len >= &with_locs[&id].file.length)
            .next();
        if let Some([loc, _]) = free_option {
            println!("Free option for {}", id);
            let file = with_locs.get_mut(&id).unwrap();
            file.memory_location = loc;
        }
    }

    let p2 = with_locs.values()
    .map(LocatedFile::checksum)
    .sum::<usize>();

    println!("{:?}", p2);
    

}